# Frequently Asked Questions (FAQ)

## General Questions

### What is Visual Q&A Chatbot?

Visual Q&A Chatbot is an AI-powered application that lets you upload an image and ask natural language questions about it. It uses OpenAI's Vision API to analyze images and Chat API to answer your questions.

### Is it free to use?

The code is open source and free (MIT License), but you'll need your own OpenAI API key, which costs money based on usage. Each session (1 image + 5 questions) costs approximately 1.1 cents. See [COSTS.md](COSTS.md) for details.

### What types of images can I upload?

- **Formats:** JPEG, PNG, GIF, WEBP
- **Max size:** 10MB
- **Types:** Photos, drawings, posters, flyers, screenshots, diagrams, charts, etc.

### How many questions can I ask per image?

You can ask up to **5 questions** per image. After that, you'll need to upload a new image to continue.

### Why is there a 5-question limit?

This demonstrates session management and helps control API costs. You can modify this limit in the code if needed (see [Configuration](#configuration-questions)).

## Setup & Installation

### What are the prerequisites?

- Node.js 18 or higher
- npm, pnpm, or yarn
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### How do I get an OpenAI API key?

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API keys section
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)
6. Add it to `backend/.env` as `OPENAI_API_KEY=sk-...`

### The setup script doesn't run. What should I do?

**On Unix/Linux/macOS:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**On Windows:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

Or install manually:
```bash
cd backend && npm install
cd ../frontend && npm install
cp backend/.env.example backend/.env
# Edit backend/.env and add your API key
```

### How do I run the application?

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Configuration Questions

### Can I use different AI models?

Yes! Edit `backend/.env`:

```env
# For vision (image analysis)
VISION_MODEL=gpt-4o              # Best quality (recommended)
# or
VISION_MODEL=gpt-4o-mini         # Budget option

# For chat (Q&A)
NLP_MODEL=gpt-4o-mini           # Recommended (fast + cheap)
# or
NLP_MODEL=gpt-4o                # Best quality (expensive)
# or
NLP_MODEL=gpt-3.5-turbo         # Fastest (cheapest)
```

See [COSTS.md](COSTS.md) for cost comparison.

### How do I change the question limit?

Edit `backend/src/routes/chat.js`:

```javascript
// Change 5 to your desired limit
if (session.questionCount >= 5) {
  // ...
}

const remainingQuestions = 5 - session.questionCount;
```

And `backend/src/routes/uploadImage.js`:

```javascript
remainingQuestions: 5  // Change here too
```

### How do I change the max upload size?

Edit `backend/src/routes/uploadImage.js`:

```javascript
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Change 10 to desired MB
  fileFilter
});
```

### Can I add more allowed image formats?

Edit `backend/src/routes/uploadImage.js`:

```javascript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',  // Add SVG
  'image/bmp'       // Add BMP
];
```

Note: Some formats may not work well with Vision API.

## Troubleshooting

### Error: "OPENAI_API_KEY environment variable is missing"

**Solution:**
1. Check that `backend/.env` file exists
2. Verify it contains `OPENAI_API_KEY=sk-...` with your actual key
3. Restart the backend server (Ctrl+C, then `npm run dev` again)
4. Make sure there are no extra spaces or quotes around the key

### Error: "You exceeded your current quota"

**Cause:** Your OpenAI account has run out of credits or hit a rate limit.

**Solution:**
1. Check your usage at [platform.openai.com/usage](https://platform.openai.com/usage)
2. Add credits to your account
3. Check your billing settings
4. Wait if you hit a rate limit (usually resets in minutes/hours)

### Image upload fails with "File too large"

**Solution:**
- Reduce image file size (compress, resize, or convert to JPEG)
- Increase the upload limit (see [Configuration](#configuration-questions))

### Chat returns weird answers

**Possible causes:**
1. **Vision description was unclear** - Try a clearer image
2. **Question is ambiguous** - Be more specific
3. **Session expired** - Upload the image again

**Tips for better results:**
- Use high-quality, well-lit images
- Ask specific, clear questions
- Avoid questions about information not visible in the image

### Frontend shows "Network error"

**Check:**
1. Is the backend running? (should see logs in terminal)
2. Is it on the correct port? (default: 3000)
3. Check browser console for CORS errors
4. Check `frontend/vite.config.js` proxy settings

### Backend crashes on startup

**Common causes:**
1. Port 3000 already in use → Change `PORT` in `.env`
2. Missing dependencies → Run `npm install` in backend
3. Node.js version too old → Upgrade to Node.js 18+

**To find what's using port 3000:**
```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

## Usage Questions

### What kind of questions can I ask?

**Good questions:**
- "What color is the car in the image?"
- "What text appears on the poster?"
- "What time does the event start according to the flyer?"
- "How many people are in the photo?"
- "What brand is visible in the image?"

**Questions that won't work well:**
- "Is this a good photo?" (subjective)
- "What happened before this photo was taken?" (requires external context)
- "What's the weather like there?" (unless clearly visible)

### Can it recognize specific people or faces?

The Vision API can detect that there are people in an image and describe their appearance, but it won't identify who they are by name (for privacy reasons).

### Does it save my images?

**Current implementation:**
- Images are saved temporarily in `backend/uploads/` during processing
- They are NOT deleted automatically (you should implement cleanup)
- Sessions are stored in memory and lost when server restarts

**For production:**
- Implement automatic cleanup of uploaded images
- Consider storing images in S3 with expiration policies
- Use Redis for session storage

### Can multiple users use it at the same time?

**Development mode:** Yes, but sessions are stored in memory and will be shared.

**Production:** You should use Redis for session storage to properly support multiple users.

## Development Questions

### How do I add tests?

**Install test framework:**
```bash
cd backend
npm install --save-dev jest @types/jest
```

**Create test file** (`backend/src/utils/sessionStore.test.js`):
```javascript
import { sessionStore } from './sessionStore.js';

describe('SessionStore', () => {
  it('creates a session', () => {
    const session = sessionStore.createSession('test description');
    expect(session.id).toBeDefined();
    expect(session.imageDescription).toBe('test description');
  });
});
```

**Run tests:**
```bash
npm test
```

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Can I use this commercially?

Yes! This project is MIT licensed, which means you can:
- ✅ Use it commercially
- ✅ Modify it
- ✅ Distribute it
- ✅ Sublicense it

Just keep the original license notice.

### How do I deploy to production?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides for various platforms (Heroku, Vercel, Render, Railway, Docker).

## Performance Questions

### How long does image analysis take?

**Typical times:**
- Vision API call: 3-8 seconds
- Chat API call: 1-3 seconds per question

**Factors:**
- Image size and complexity
- Network latency
- OpenAI API load

### How can I make it faster?

1. **Use smaller images** (resize before upload)
2. **Use faster models** (gpt-4o-mini for chat)
3. **Implement caching** (save descriptions for duplicate images)
4. **Use streaming** (show partial responses as they arrive)

### Does it work offline?

No, it requires internet connection to call OpenAI APIs. You could use local AI models (BLIP-2, LLaVA) for offline use, but quality would be lower.

## Cost Questions

### How much does it cost to run?

See [COSTS.md](COSTS.md) for detailed cost analysis.

**Summary:**
- ~1.1¢ per session (1 image + 5 questions)
- ~$1 for 100 sessions
- Hosting: $5-25/month

### How can I reduce costs?

1. Use `gpt-4o-mini` for vision (8x cheaper, decent quality)
2. Implement image description caching
3. Reduce question limit from 5 to 3
4. Add rate limiting to prevent abuse
5. Optimize system prompts (reduce token count)

See [COSTS.md](COSTS.md) for detailed strategies.

## Security Questions

### Is my API key safe?

**Current implementation:**
- ✅ API key stored in `.env` (not in code)
- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ API key never sent to frontend
- ⚠️ No authentication (anyone with URL can use it)

**For production:**
- Add user authentication
- Add rate limiting
- Use environment variable management (Heroku Config Vars, etc.)

### Can people abuse my API key?

**In development:** Yes, if they access your local server.

**In production:** Yes, unless you add:
1. Rate limiting (max requests per IP/user)
2. Authentication (require login)
3. API usage monitoring and alerts

See [DEPLOYMENT.md](DEPLOYMENT.md) security section.

### Is user data private?

**Current implementation:**
- Images stored locally (not private)
- Sessions in memory (lost on restart)
- No encryption

**For production:**
- Use HTTPS
- Encrypt stored images
- Add user authentication
- Implement data retention policies

## Still Have Questions?

- 📖 Check the [README](../README.md) for general info
- 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- 💰 Check [COSTS.md](COSTS.md) for cost analysis
- 🐛 Open an issue on GitHub
- 💬 Start a discussion in GitHub Discussions

---

**Last updated:** December 2025

