# Contributing to Visual Q&A Chatbot

First off, thank you for considering contributing to Visual Q&A Chatbot! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

#### Coding Standards

**JavaScript/React:**
- Use modern ES6+ syntax
- Follow existing code style
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

**File Structure:**
- Backend code in `backend/src/`
- Frontend code in `frontend/src/`
- Keep components modular and reusable

**Commits:**
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

### Development Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/visual-qa-chatbot.git
cd visual-qa-chatbot
```

2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Create `.env` file in `backend/`:
```env
OPENAI_API_KEY=your-test-key
VISION_MODEL=gpt-4o
NLP_MODEL=gpt-4o-mini
PORT=3000
```

4. Run in development mode:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Testing

Before submitting a PR, ensure:
- [ ] The application runs without errors
- [ ] Image upload works correctly
- [ ] Chat functionality works as expected
- [ ] Session expiration (5 questions) works
- [ ] Error handling displays properly
- [ ] No console errors in browser or backend

### Project Structure

```
visual-qa-chatbot/
├── backend/
│   ├── src/
│   │   ├── routes/          # Express routes
│   │   ├── services/        # AI API clients
│   │   └── utils/           # Session management
│   └── uploads/             # Temporary image storage
├── frontend/
│   └── src/
│       ├── components/      # React components
│       └── App.jsx          # Main app component
└── README.md
```

## Feature Request Ideas

Here are some areas where contributions would be especially valuable:

- [ ] **Testing**: Unit tests, integration tests, E2E tests
- [ ] **Storage**: Redis session store implementation
- [ ] **Cloud Storage**: S3/Cloudinary integration for images
- [ ] **Authentication**: JWT or OAuth implementation
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Multi-language**: i18n support
- [ ] **Dark Mode**: Theme toggle
- [ ] **Export**: Download conversation history
- [ ] **Multiple Images**: Compare multiple images in one session
- [ ] **Streaming**: Stream AI responses in real-time
- [ ] **Analytics**: Usage tracking and statistics
- [ ] **Docker**: Containerization
- [ ] **CI/CD**: GitHub Actions workflows

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Visual Q&A Chatbot better! 🎉

