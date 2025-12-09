# Architecture Documentation

## Overview

Visual Q&A Chatbot follows a client-server architecture with AI integration for computer vision and natural language processing.

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                    │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐           │
│  │ ImageUpload│  │ ChatWindow │  │QuestionInput│           │
│  │ Component  │  │ Component  │  │  Component  │           │
│  └────────────┘  └────────────┘  └─────────────┘           │
│                                                              │
│  State Management: React Hooks (useState, useEffect, useRef) │
│  Styling: CSS Modules                                        │
│  HTTP Client: Fetch API                                      │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP REST API
                         │ (JSON)
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                      ROUTES                         │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ POST         │  │ POST         │               │    │
│  │  │ /upload-image│  │ /chat        │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    SERVICES                         │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ visionClient │  │  nlpClient   │               │    │
│  │  │  (GPT-4o)    │  │(GPT-4o-mini) │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                     UTILITIES                       │    │
│  │  ┌──────────────────────────────┐                  │    │
│  │  │     sessionStore             │                  │    │
│  │  │  (In-Memory Map)             │                  │    │
│  │  │  - Create/Get/Update/Delete  │                  │    │
│  │  │  - Auto cleanup              │                  │    │
│  │  └──────────────────────────────┘                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                              │
│  Middleware: CORS, JSON parser, Multer (file upload)        │
└────────────┬─────────────────────┬───────────────────────────┘
             │                     │
             │                     │
             ↓                     ↓
┌─────────────────────┐  ┌─────────────────────┐
│   OpenAI Vision API │  │  OpenAI Chat API    │
│      (GPT-4o)       │  │   (GPT-4o-mini)     │
│                     │  │                     │
│  - Image analysis   │  │  - Q&A generation   │
│  - OCR              │  │  - Context-aware    │
│  - Detail: high     │  │  - Temperature: 0.7 │
│  - Max tokens: 1500 │  │  - Max tokens: 500  │
└─────────────────────┘  └─────────────────────┘
```

## Data Flow

### 1. Image Upload Flow

```
User selects image
    ↓
Frontend creates FormData
    ↓
POST /api/upload-image
    ↓
Multer middleware saves to uploads/
    ↓
visionClient.describeImage(path)
    ↓
OpenAI Vision API analyzes image
    ↓
Returns detailed description (string)
    ↓
sessionStore.createSession(description)
    ↓
Returns { sessionId, descriptionPreview, remainingQuestions: 5 }
    ↓
Frontend stores sessionId & displays preview
```

### 2. Chat Flow

```
User types question
    ↓
POST /api/chat { sessionId, question }
    ↓
Validate sessionId exists
    ↓
Check questionCount < 5
    ↓
nlpClient.answerQuestion({ question, imageDescription, chatHistory })
    ↓
Build prompt:
  - System: instructions + imageDescription
  - History: last 3 turns
  - User: current question
    ↓
OpenAI Chat API generates answer
    ↓
Update session:
  - chatHistory.push(user, assistant)
  - questionCount++
    ↓
Returns { answer, remainingQuestions, questionsUsed, sessionActive }
    ↓
Frontend displays answer & updates counter
```

### 3. Session Expiration Flow

```
questionCount reaches 5
    ↓
Next chat request checks: questionCount >= 5
    ↓
sessionStore.deleteSession(sessionId)
    ↓
Returns 403 { error: 'SESSION_EXPIRED', ... }
    ↓
Frontend displays system message
    ↓
Clears sessionId & disables input
    ↓
User must upload new image
```

## Component Breakdown

### Frontend Components

#### App.jsx (Main Component)
**Responsibilities:**
- Global state management
- API communication
- Orchestrates child components

**State:**
```javascript
{
  selectedFile: File | null,
  imagePreviewUrl: string | null,
  sessionId: string | null,
  messages: Array<{role, content}>,
  questionInput: string,
  remainingQuestions: number,
  isUploading: boolean,
  isSending: boolean,
  error: string | null
}
```

**Key Functions:**
- `handleFileChange`: Captures file and creates preview
- `handleUpload`: Uploads image, creates session
- `handleSendQuestion`: Sends question, updates chat
- `handleReset`: Clears session for new image

#### ImageUpload Component
**Props:**
- `selectedFile`, `imagePreviewUrl`, `onFileChange`, `onUpload`, `onReset`, `isUploading`, `hasSession`

**Responsibilities:**
- File input and preview
- Upload button with loading state
- Reset button for new images
- How-it-works instructions

#### ChatWindow Component
**Props:**
- `messages`, `chatEndRef`

**Responsibilities:**
- Render message list
- Differentiate user/bot/system messages
- Auto-scroll to latest message
- Empty state display

#### QuestionInput Component
**Props:**
- `value`, `onChange`, `onSend`, `disabled`, `isSending`

**Responsibilities:**
- Text input for questions
- Send button with loading state
- Enter key handling
- Disabled state when no session

### Backend Routes

#### POST /api/upload-image
**Handler:** `uploadImage.js`

**Middleware:**
- `multer.single('image')` - File upload handling

**Process:**
1. Validate file exists
2. Call `describeImage(path)`
3. Create session with description
4. Return session info

**Response:**
```json
{
  "sessionId": "uuid",
  "descriptionPreview": "string",
  "remainingQuestions": 5,
  "message": "string"
}
```

#### POST /api/chat
**Handler:** `chat.js`

**Validations:**
1. `sessionId` and `question` required
2. Session exists
3. `questionCount < 5`

**Process:**
1. Get session
2. Call `answerQuestion(...)`
3. Update history and count
4. Return answer

**Response:**
```json
{
  "answer": "string",
  "remainingQuestions": 4,
  "questionsUsed": 1,
  "sessionActive": true
}
```

### Backend Services

#### visionClient.js
**Function:** `describeImage(imagePath)`

**Process:**
1. Read image file
2. Convert to base64
3. Build OpenAI request with detailed prompt
4. Return description string

**Prompt Structure:**
- Expert image analyst role
- 4 analysis sections:
  1. Visual description
  2. OCR (text extraction)
  3. Semantic info (for posters/events)
  4. Character/brand recognition
- Inference guidelines

#### nlpClient.js
**Function:** `answerQuestion({ question, imageDescription, chatHistory })`

**Process:**
1. Build messages array:
   - System: rules + imageDescription
   - History: last 6 messages
   - User: question
2. Call OpenAI Chat API
3. Return answer

**System Prompt:**
- Explains model doesn't see image directly
- Lists available context types
- Rules for answering (no hallucinations, allow reasonable inferences)

### Backend Utilities

#### sessionStore.js
**Class:** `SessionStore`

**Data Structure:**
```javascript
Map<sessionId, {
  id: string,
  imageDescription: string,
  chatHistory: Array<{role, content}>,
  questionCount: number,
  createdAt: Date
}>
```

**Methods:**
- `createSession(description)` → session
- `getSession(id)` → session | undefined
- `updateSession(id, updates)` → session
- `deleteSession(id)` → boolean
- `cleanupOldSessions(maxAge)` → void

**Features:**
- UUID v4 for session IDs
- Automatic cleanup every 30 minutes (sessions > 1 hour old)
- Singleton instance export

## Design Decisions

### Why Two AI Models?

1. **GPT-4o for Vision:**
   - Native vision capabilities
   - High-quality detailed descriptions
   - Worth the cost (1 call per session)

2. **GPT-4o-mini for Chat:**
   - Sufficient for Q&A with clear context
   - 15-60x cheaper than GPT-4o
   - Faster responses (better UX)
   - 5 calls per session = cost savings

### Why In-Memory Sessions?

**Pros:**
- Zero external dependencies
- Minimal latency (Map lookup)
- Simple implementation
- Perfect for prototypes/demos

**Cons:**
- Not persistent (lost on restart)
- Not shared across instances
- Limited by RAM

**Migration Path:**
- Use Redis for production (shared state, persistence)

### Why 5-Question Limit?

**Reasoning:**
- Simulates token/cost constraints
- Encourages focused questions
- Prevents infinite sessions
- Demonstrates session lifecycle

**Implementation:**
- Backend enforces hard limit
- Frontend tracks and displays
- Session deleted after limit

### Why Separate Description Step?

**Benefits:**
- Description generated once, reused 5 times
- Massive cost savings (1 vision call vs potentially 5)
- User sees what AI "sees" (transparency)
- Enables debugging (inspect description)
- Future: could cache descriptions for same image

## Security Considerations

### Current Implementation

1. **API Keys:**
   - Stored in environment variables
   - Never exposed to frontend
   - Not committed to git

2. **File Validation:**
   - MIME type checking
   - Size limit (10MB)
   - Allowed formats only

3. **Input Sanitization:**
   - Question trimming
   - Type validation
   - Empty string checks

4. **CORS:**
   - Enabled for development
   - Should be restricted in production

### Production Recommendations

1. **Authentication:**
   - Add JWT or session-based auth
   - Protect API routes

2. **Rate Limiting:**
   - Prevent API abuse
   - Per-user or per-IP limits

3. **Input Validation:**
   - Deeper sanitization
   - File content validation (magic numbers)

4. **Monitoring:**
   - Log all API calls
   - Alert on unusual patterns
   - Track costs

## Scalability Considerations

### Current Limitations

1. **In-Memory Sessions:**
   - Single instance only
   - Lost on crash/restart

2. **Local File Storage:**
   - Not shared across instances
   - Fills up disk

3. **No Caching:**
   - Same image = duplicate API calls

### Scaling Solutions

1. **Session Storage:**
   - Migrate to Redis
   - Enables horizontal scaling
   - Persistence across restarts

2. **Image Storage:**
   - Use S3/Cloudinary
   - CDN for delivery
   - Cleanup policies

3. **Caching:**
   - Cache image descriptions by hash
   - Reduce duplicate Vision API calls

4. **Load Balancing:**
   - Multiple backend instances
   - Shared Redis for sessions
   - Shared S3 for images

## Testing Strategy

### Unit Tests (Recommended)

- **sessionStore:** CRUD operations, cleanup
- **visionClient:** Mock OpenAI API
- **nlpClient:** Mock OpenAI API
- **Routes:** Request validation

### Integration Tests (Recommended)

- **Upload flow:** End-to-end with mock AI
- **Chat flow:** Full conversation cycle
- **Session expiration:** 5-question limit

### E2E Tests (Recommended)

- **Full user flow:** Upload → 5 questions → expire
- **Error cases:** Invalid file, no session, etc.

## Future Enhancements

### Short Term
- Redis session store
- S3 image storage
- Basic auth
- Rate limiting

### Medium Term
- Multi-image sessions
- Streaming AI responses
- Conversation export
- Dark mode

### Long Term
- Multi-user accounts
- Image comparison
- Custom AI models
- Analytics dashboard

---

For implementation details, see the source code. For deployment, see [DEPLOYMENT.md](DEPLOYMENT.md).

