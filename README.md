# 🖼️ Visual Q&A Chatbot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)

> A full-stack AI-powered application that allows users to upload images and ask questions about them using computer vision and natural language processing.

[English](#english) | [Español](#español)

---

## English

### 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

### ✨ Features

- 🎨 **Image Upload**: Support for JPEG, PNG, GIF, and WEBP formats (max 10MB)
- 🔍 **Advanced Vision AI**: Detailed image analysis including:
  - Visual description (objects, colors, composition)
  - OCR (text extraction)
  - Event information extraction (for posters/flyers)
  - Character and brand recognition
- 💬 **Interactive Chat**: Natural language Q&A about uploaded images
- 🔒 **Session Management**: 5-question limit per image with automatic cleanup
- 🎯 **Smart Context**: AI answers based solely on image description
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Feedback**: Loading states and error handling

### 🎬 Demo

1. Upload an image (event poster, product photo, chart, etc.)
2. AI analyzes and generates a detailed description
3. Ask up to 5 questions about the image
4. Get AI-powered answers based on the image content
5. Upload a new image to continue

### 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- Vite (build tool)
- CSS Modules
- Fetch API

**Backend:**
- Node.js + Express
- OpenAI API (GPT-4o for vision, GPT-4o-mini for chat)
- Multer (file uploads)
- In-memory session storage (Map)

### 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│  React Frontend     │
│  (Vite)             │
└──────┬──────────────┘
       │ HTTP API
       ↓
┌─────────────────────┐
│  Express Backend    │
│  - Routes           │
│  - Services         │
│  - Session Store    │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  OpenAI APIs        │
│  - Vision (GPT-4o)  │
│  - Chat (GPT-4o-mini)│
└─────────────────────┘
```

**Flow:**
1. User uploads image → Vision API generates detailed description
2. Description stored in session (with unique session ID)
3. User asks questions → NLP API answers based on description
4. After 5 questions → session expires, new image required

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

#### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/visual-qa-chatbot.git
cd visual-qa-chatbot
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
VISION_MODEL=gpt-4o
NLP_MODEL=gpt-4o-mini
PORT=3000
```

See [Configuration](#configuration) for all available options.

#### Running the Application

**Development Mode:**

1. **Start the backend** (from `backend/` directory):

```bash
npm run dev
```

Backend will run on `http://localhost:3000`

2. **Start the frontend** (from `frontend/` directory, new terminal):

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

**Production Mode:**

```bash
# Backend
cd backend
npm start

# Frontend (build first)
cd frontend
npm run build
npm run preview
```

### ⚙️ Configuration

#### Environment Variables

Create a `.env` file in `backend/` directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | ✅ Yes |
| `VISION_MODEL` | Model for image analysis | `gpt-4o` | No |
| `NLP_MODEL` | Model for chat responses | `gpt-4o-mini` | No |
| `PORT` | Backend server port | `3000` | No |

#### Model Selection

**Vision Models** (for image analysis):
- `gpt-4o` - Best quality, higher cost
- `gpt-4o-mini` - Basic vision, lower cost

**NLP Models** (for Q&A):
- `gpt-4o-mini` - Recommended, good balance
- `gpt-4o` - Higher quality, higher cost
- `gpt-3.5-turbo` - Faster, lower cost

### 📚 API Documentation

#### `POST /api/upload-image`

Upload an image and create a new session.

**Request:**
- `Content-Type`: `multipart/form-data`
- Body: `image` (file field)

**Response:**
```json
{
  "sessionId": "uuid-v4",
  "descriptionPreview": "First 200 chars...",
  "remainingQuestions": 5,
  "message": "Image processed successfully..."
}
```

#### `POST /api/chat`

Ask a question about the uploaded image.

**Request:**
```json
{
  "sessionId": "uuid-v4",
  "question": "What color is the main object?"
}
```

**Response:**
```json
{
  "answer": "The main object is red...",
  "remainingQuestions": 4,
  "questionsUsed": 1,
  "sessionActive": true
}
```

**Error Response (Session Expired):**
```json
{
  "error": "SESSION_EXPIRED",
  "message": "You have reached the 5-question limit...",
  "questionsUsed": 5
}
```

#### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 🚢 Deployment

#### Deploying to Production

**Backend (Node.js):**
- Deploy to: Heroku, Railway, Render, AWS, DigitalOcean
- Set environment variables in platform dashboard
- Ensure `uploads/` directory is writable

**Frontend (React):**
- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront
- Update API base URL if backend is on different domain

**Recommended Improvements for Production:**
- Use Redis for session storage (multi-instance support)
- Store images in S3/Cloudinary instead of local disk
- Add authentication (JWT, OAuth)
- Implement rate limiting
- Add monitoring (Sentry, Datadog)
- Use HTTPS

### 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- OpenAI for GPT-4o and GPT-4o-mini APIs
- React and Vite communities
- All contributors

---

## Español

### 📋 Tabla de Contenidos

- [Características](#características)
- [Demostración](#demostración)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura-1)
- [Comenzando](#comenzando)
- [Configuración](#configuración-1)
- [Documentación de API](#documentación-de-api)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia-1)

### ✨ Características

- 🎨 **Carga de Imágenes**: Soporte para formatos JPEG, PNG, GIF y WEBP (máx 10MB)
- 🔍 **IA de Visión Avanzada**: Análisis detallado de imágenes incluyendo:
  - Descripción visual (objetos, colores, composición)
  - OCR (extracción de texto)
  - Extracción de información de eventos (para posters/flyers)
  - Reconocimiento de personajes y marcas
- 💬 **Chat Interactivo**: Preguntas y respuestas en lenguaje natural sobre imágenes
- 🔒 **Gestión de Sesiones**: Límite de 5 preguntas por imagen con limpieza automática
- 🎯 **Contexto Inteligente**: IA responde basándose únicamente en la descripción de la imagen
- 📱 **Diseño Responsivo**: Funciona en dispositivos de escritorio y móviles
- ⚡ **Retroalimentación en Tiempo Real**: Estados de carga y manejo de errores

### 🎬 Demostración

1. Sube una imagen (poster de evento, foto de producto, gráfico, etc.)
2. La IA analiza y genera una descripción detallada
3. Haz hasta 5 preguntas sobre la imagen
4. Obtén respuestas generadas por IA basadas en el contenido de la imagen
5. Sube una nueva imagen para continuar

### 🛠️ Stack Tecnológico

**Frontend:**
- React 18 con Hooks
- Vite (herramienta de build)
- CSS Modules
- Fetch API

**Backend:**
- Node.js + Express
- API de OpenAI (GPT-4o para visión, GPT-4o-mini para chat)
- Multer (carga de archivos)
- Almacenamiento de sesiones en memoria (Map)

### 🏗️ Arquitectura

El sistema sigue una arquitectura cliente-servidor con integración de APIs de IA:

**Flujo:**
1. Usuario sube imagen → API de Visión genera descripción detallada
2. Descripción almacenada en sesión (con ID de sesión único)
3. Usuario hace preguntas → API de NLP responde basándose en descripción
4. Después de 5 preguntas → sesión expira, se requiere nueva imagen

### 🚀 Comenzando

#### Prerrequisitos

- Node.js 18+ y npm/pnpm/yarn
- Clave API de OpenAI ([obténla aquí](https://platform.openai.com/api-keys))

#### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tuusuario/visual-qa-chatbot.git
cd visual-qa-chatbot
```

2. **Instalar dependencias del backend**

```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**

```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**

Crea un archivo `.env` en el directorio `backend/`:

```env
OPENAI_API_KEY=sk-tu-clave-api-real-aqui
VISION_MODEL=gpt-4o
NLP_MODEL=gpt-4o-mini
PORT=3000
```

Ver [Configuración](#configuración-1) para todas las opciones disponibles.

#### Ejecutar la Aplicación

**Modo Desarrollo:**

1. **Iniciar el backend** (desde directorio `backend/`):

```bash
npm run dev
```

El backend correrá en `http://localhost:3000`

2. **Iniciar el frontend** (desde directorio `frontend/`, nueva terminal):

```bash
npm run dev
```

El frontend correrá en `http://localhost:5173`

3. **Abrir tu navegador** y navegar a `http://localhost:5173`

### ⚙️ Configuración

#### Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

| Variable | Descripción | Por Defecto | Requerida |
|----------|-------------|-------------|-----------|
| `OPENAI_API_KEY` | Tu clave API de OpenAI | - | ✅ Sí |
| `VISION_MODEL` | Modelo para análisis de imágenes | `gpt-4o` | No |
| `NLP_MODEL` | Modelo para respuestas de chat | `gpt-4o-mini` | No |
| `PORT` | Puerto del servidor backend | `3000` | No |

#### Selección de Modelos

**Modelos de Visión** (para análisis de imágenes):
- `gpt-4o` - Mejor calidad, mayor costo
- `gpt-4o-mini` - Visión básica, menor costo

**Modelos NLP** (para Q&A):
- `gpt-4o-mini` - Recomendado, buen balance
- `gpt-4o` - Mayor calidad, mayor costo
- `gpt-3.5-turbo` - Más rápido, menor costo

### 🚢 Despliegue

**Backend (Node.js):**
- Desplegar en: Heroku, Railway, Render, AWS, DigitalOcean
- Configurar variables de entorno en el dashboard de la plataforma

**Frontend (React):**
- Build: `npm run build`
- Desplegar en: Vercel, Netlify, AWS S3 + CloudFront

**Mejoras recomendadas para producción:**
- Usar Redis para almacenamiento de sesiones
- Almacenar imágenes en S3/Cloudinary
- Agregar autenticación
- Implementar rate limiting
- Agregar monitoreo

### 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

### 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Hecho con ❤️ por la comunidad Open Source**
