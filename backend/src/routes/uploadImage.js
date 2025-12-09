import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { describeImage } from '../services/visionClient.js';
import { sessionStore } from '../utils/sessionStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed'));
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'No image file provided'
      });
    }

    console.log(`Image uploaded: ${req.file.filename}`);

    const imageDescription = await describeImage(req.file.path);

    const session = sessionStore.createSession(imageDescription);

    const descriptionPreview = imageDescription;

    res.json({
      sessionId: session.id,
      descriptionPreview,
      remainingQuestions: 5,
      message: 'Image processed successfully. You can now ask up to 5 questions about this image.'
    });

  } catch (error) {
    console.error('Upload error:', error);

    if (error.message.includes('Vision API')) {
      return res.status(503).json({
        error: 'VISION_API_ERROR',
        message: 'Failed to analyze the image. Please try again.'
      });
    }

    res.status(500).json({
      error: 'UPLOAD_ERROR',
      message: error.message || 'Failed to process image upload'
    });
  }
});

export default router;
