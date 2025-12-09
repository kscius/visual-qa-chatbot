# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-09

### Added
- Initial release of Visual Q&A Chatbot
- Image upload functionality (JPEG, PNG, GIF, WEBP support)
- OpenAI Vision API integration (GPT-4o) for detailed image analysis
- Advanced vision prompts with support for:
  - Visual description (objects, colors, composition)
  - OCR (text extraction)
  - Event information extraction (posters/flyers)
  - Character and brand recognition
- OpenAI Chat API integration (GPT-4o-mini) for Q&A
- Session management with 5-question limit per image
- In-memory session storage with automatic cleanup
- React frontend with Vite
- Responsive design with CSS Modules
- Real-time loading states and error handling
- Comprehensive API documentation
- MIT License
- Contributing guidelines
- Bilingual README (English + Spanish)

### Features
- 🎨 Upload images up to 10MB
- 🔍 AI-powered detailed image analysis
- 💬 Interactive chat with context-aware responses
- 🔒 Secure session management
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly design

### Technical Details
- **Backend**: Node.js 18+, Express, OpenAI SDK, Multer
- **Frontend**: React 18, Vite, CSS Modules
- **Architecture**: RESTful API, in-memory sessions
- **AI Models**: GPT-4o (vision), GPT-4o-mini (chat)

## [Unreleased]

### Planned Features
- [ ] Redis integration for session storage
- [ ] S3/Cloudinary integration for image storage
- [ ] User authentication (JWT/OAuth)
- [ ] Rate limiting
- [ ] Unit and integration tests
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Conversation export (PDF/JSON)
- [ ] Streaming AI responses
- [ ] Multiple images per session
- [ ] Image comparison feature
- [ ] Analytics dashboard

---

[1.0.0]: https://github.com/yourusername/visual-qa-chatbot/releases/tag/v1.0.0

