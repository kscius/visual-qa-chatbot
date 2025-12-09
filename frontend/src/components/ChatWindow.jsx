import React from 'react';
import styles from '../App.module.css';

function ChatWindow({ messages, chatEndRef }) {
  if (messages.length === 0) {
    return (
      <div className={styles.chatMessages}>
        <div className={styles.emptyState}>
          <p>👋 Upload an image to start chatting!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatMessages}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${styles.message} ${styles[message.role]}`}
        >
          <div className={styles.messageContent}>
            {message.role === 'user' && <strong>You:</strong>}
            {message.role === 'bot' && <strong>AI:</strong>}
            {message.role === 'system' && <strong>System:</strong>}
            <p>{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow;
