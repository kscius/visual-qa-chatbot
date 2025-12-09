import React from 'react';
import styles from '../App.module.css';

function QuestionInput({ value, onChange, onSend, disabled, isSending }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? 'Upload an image to ask questions...' : 'Ask a question about the image...'}
        disabled={disabled}
        className={styles.questionInput}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={styles.sendButton}
      >
        {isSending ? (
          <span className={styles.spinner}></span>
        ) : (
          '➤'
        )}
      </button>
    </div>
  );
}

export default QuestionInput;
