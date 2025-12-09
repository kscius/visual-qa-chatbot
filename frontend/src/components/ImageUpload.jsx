import React from 'react';
import styles from '../App.module.css';

function ImageUpload({
  selectedFile,
  imagePreviewUrl,
  onFileChange,
  onUpload,
  onReset,
  isUploading,
  hasSession
}) {
  return (
    <div className={styles.uploadPanel}>
      <h2>📤 Upload Image</h2>

      <div className={styles.fileInputContainer}>
        <input
          type="file"
          id="imageInput"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onFileChange}
          className={styles.fileInput}
          disabled={isUploading}
        />
        <label htmlFor="imageInput" className={styles.fileLabel}>
          {selectedFile ? '✓ Change Image' : '+ Select Image'}
        </label>
      </div>

      {imagePreviewUrl && (
        <div className={styles.previewContainer}>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className={styles.imagePreview}
          />
        </div>
      )}

      {selectedFile && !hasSession && (
        <button
          onClick={onUpload}
          disabled={isUploading}
          className={styles.uploadButton}
        >
          {isUploading ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      )}

      {hasSession && (
        <button onClick={onReset} className={styles.resetButton}>
          🔄 Upload New Image
        </button>
      )}

      <div className={styles.infoBox}>
        <p><strong>ℹ️ How it works:</strong></p>
        <ol>
          <li>Upload an image</li>
          <li>AI analyzes and describes it</li>
          <li>Ask up to 5 questions</li>
          <li>Get answers based on the image</li>
        </ol>
      </div>
    </div>
  );
}

export default ImageUpload;
