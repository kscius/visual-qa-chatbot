import React, { useState, useRef, useEffect } from 'react';
import ImageUpload from './components/ImageUpload.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import QuestionInput from './components/QuestionInput.jsx';
import styles from './App.module.css';

const API_BASE_URL = '/api';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [remainingQuestions, setRemainingQuestions] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setSessionId(data.sessionId);
      setRemainingQuestions(data.remainingQuestions);
      setMessages([
        {
          role: 'system',
          content: `✅ Image processed successfully!\n\n📝 Preview: ${data.descriptionPreview}\n\nYou can now ask up to 5 questions about this image.`
        }
      ]);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendQuestion = async () => {
    const trimmedQuestion = questionInput.trim();

    if (!trimmedQuestion) {
      return;
    }

    if (!sessionId) {
      setError('Please upload an image first');
      return;
    }

    if (remainingQuestions <= 0) {
      setError('Question limit reached. Please upload a new image.');
      return;
    }

    const userMessage = { role: 'user', content: trimmedQuestion };
    setMessages(prev => [...prev, userMessage]);
    setQuestionInput('');
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          question: trimmedQuestion
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'SESSION_EXPIRED') {
          setMessages(prev => [
            ...prev,
            {
              role: 'system',
              content: '⏱️ Session expired. You have used all 5 questions for this image. Please upload a new image to continue.'
            }
          ]);
          setSessionId(null);
          setRemainingQuestions(0);
          return;
        }

        throw new Error(data.message || 'Failed to get answer');
      }

      const botMessage = { role: 'bot', content: data.answer };
      setMessages(prev => [...prev, botMessage]);
      setRemainingQuestions(data.remainingQuestions);

      if (data.remainingQuestions === 0) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: 'system',
              content: '⏱️ You have used all 5 questions. Please upload a new image to continue chatting.'
            }
          ]);
          setSessionId(null);
        }, 500);
      }

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send question');
      
      setMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: `❌ Error: ${err.message}`
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setSessionId(null);
    setMessages([]);
    setQuestionInput('');
    setRemainingQuestions(0);
    setError(null);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🖼️ Visual Q&A Chatbot</h1>
        <p>Upload an image and ask questions about it</p>
      </header>

      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <ImageUpload
            selectedFile={selectedFile}
            imagePreviewUrl={imagePreviewUrl}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            onReset={handleReset}
            isUploading={isUploading}
            hasSession={!!sessionId}
          />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
              <h2>💬 Chat</h2>
              {sessionId && (
                <div className={styles.questionCounter}>
                  <span className={remainingQuestions <= 2 ? styles.warning : ''}>
                    {remainingQuestions}/5 questions remaining
                  </span>
                </div>
              )}
            </div>

            <ChatWindow messages={messages} chatEndRef={chatEndRef} />

            <QuestionInput
              value={questionInput}
              onChange={setQuestionInput}
              onSend={handleSendQuestion}
              disabled={!sessionId || remainingQuestions <= 0 || isSending}
              isSending={isSending}
            />

            {error && (
              <div className={styles.error}>
                ❌ {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
