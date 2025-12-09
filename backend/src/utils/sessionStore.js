import { v4 as uuidv4 } from 'uuid';

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createSession(imageDescription) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      imageDescription,
      chatHistory: [],
      questionCount: 0,
      createdAt: new Date()
    };
    
    this.sessions.set(sessionId, session);
    console.log(`Session created: ${sessionId}`);
    
    return session;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    Object.assign(session, updates);
    this.sessions.set(sessionId, session);
    
    return session;
  }

  deleteSession(sessionId) {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      console.log(`Session deleted: ${sessionId}`);
    }
    return deleted;
  }

  getSessionCount() {
    return this.sessions.size;
  }

  cleanupOldSessions(maxAgeMs = 3600000) {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.createdAt.getTime() > maxAgeMs) {
        this.deleteSession(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} old sessions`);
    }
  }
}

export const sessionStore = new SessionStore();

setInterval(() => {
  sessionStore.cleanupOldSessions();
}, 1800000);
