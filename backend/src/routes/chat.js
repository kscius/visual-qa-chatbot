import express from 'express';
import { answerQuestion } from '../services/nlpClient.js';
import { sessionStore } from '../utils/sessionStore.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { sessionId, question } = req.body;

    if (!sessionId || !question) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'sessionId and question are required'
      });
    }

    if (typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Question must be a non-empty string'
      });
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found. Please upload a new image to start a session.'
      });
    }

    if (session.questionCount >= 5) {
      sessionStore.deleteSession(sessionId);
      
      return res.status(403).json({
        error: 'SESSION_EXPIRED',
        message: 'You have reached the 5-question limit for this image. Please upload a new image to continue.',
        questionsUsed: 5
      });
    }

    console.log(`Question ${session.questionCount + 1}/5 for session ${sessionId}`);

    const answer = await answerQuestion({
      question: question.trim(),
      imageDescription: session.imageDescription,
      chatHistory: session.chatHistory
    });

    session.chatHistory.push(
      { role: 'user', content: question.trim() },
      { role: 'assistant', content: answer }
    );
    session.questionCount += 1;
    sessionStore.updateSession(sessionId, session);

    const remainingQuestions = 5 - session.questionCount;

    res.json({
      answer,
      remainingQuestions,
      questionsUsed: session.questionCount,
      sessionActive: remainingQuestions > 0
    });

  } catch (error) {
    console.error('Chat error:', error);

    if (error.message.includes('NLP API') || error.message.includes('generate answer')) {
      return res.status(503).json({
        error: 'NLP_API_ERROR',
        message: 'Failed to generate an answer. Please try again.'
      });
    }

    res.status(500).json({
      error: 'CHAT_ERROR',
      message: error.message || 'Failed to process your question'
    });
  }
});

export default router;
