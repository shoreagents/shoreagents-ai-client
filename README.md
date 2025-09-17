# ShoreAgents AI - Electron App

A modern Electron desktop application built with Next.js and Shadcn/ui.

## Features

- 🖥️ **Electron Desktop App** - Cross-platform desktop application
- ⚛️ **Next.js 15** - React framework with App Router
- 🎨 **Shadcn/ui** - Beautiful, accessible UI components
- 🎯 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 📊 **Dashboard** - Interactive dashboard with charts and data tables
- 🤖 **AI-Powered RAG** - Retrieval Augmented Generation with Qdrant vector database
- 🔍 **Semantic Search** - Advanced document search and retrieval
- 💬 **Intelligent Chatbot** - AI-powered talent analysis and recommendations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for Qdrant vector database)
- OpenAI API key (for embeddings)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key and other configuration
   ```
4. Start Qdrant vector database:
   ```bash
   npm run qdrant:start
   ```
5. Test Qdrant connection:
   ```bash
   npm run qdrant:test
   ```

### Development

To run the app in development mode:

```bash
npm run electron-dev
```

This will:
- Start the Next.js development server
- Wait for the server to be ready
- Launch the Electron app

### Building for Production

To build the app for distribution:

```bash
npm run electron-build
```

This will:
- Build the Next.js app
- Export it as static files
- Package it with Electron

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js app
- `npm run electron` - Run Electron app (requires built app)
- `npm run electron-dev` - Run in development mode
- `npm run electron-build` - Build for production
- `npm run lint` - Run ESLint

#### Qdrant Scripts

- `npm run qdrant:start` - Start Qdrant vector database
- `npm run qdrant:stop` - Stop Qdrant vector database
- `npm run qdrant:logs` - View Qdrant logs
- `npm run qdrant:test` - Test Qdrant connection

## Project Structure

```
├── electron/
│   └── main.js          # Electron main process
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── dashboard/   # Dashboard page
│   │   └── globals.css  # Global styles
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn/ui components
│   │   └── ...         # Custom components
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Dashboard Features

The app includes a comprehensive dashboard with:

- 📊 Interactive charts and graphs
- 📋 Data tables with sorting and filtering
- 🎨 Modern, responsive design
- 🌙 Dark/light theme support
- 📱 Mobile-responsive layout

## RAG System

The application includes a sophisticated Retrieval Augmented Generation (RAG) system powered by Qdrant:

### Features

- 🔍 **Semantic Search** - Find relevant documents using natural language queries
- 📚 **Document Indexing** - Automatically index talent profiles and documents
- 🤖 **AI-Powered Chat** - Intelligent chatbot with context-aware responses
- 🎯 **Talent Matching** - Advanced talent search and recommendation
- 📊 **Source Attribution** - Track sources used in AI responses

### API Endpoints

- `POST /api/rag/documents` - Index documents
- `GET /api/rag/documents` - Search documents
- `GET /api/rag/stats` - Get collection statistics

### Configuration

The RAG system automatically falls back to existing PGVector/Memory storage if Qdrant is unavailable, ensuring continuous operation.

For detailed setup instructions, see [QDRANT_SETUP.md](documents/QDRANT_SETUP.md).

## Technologies Used

- **Electron** - Desktop app framework
- **Next.js 15** - React framework
- **Shadcn/ui** - UI component library
- **Tailwind CSS v3** - CSS framework
- **TypeScript** - Type safety
- **Recharts** - Chart library
- **Lucide React** - Icons
- **Qdrant** - Vector database for RAG
- **OpenAI** - Embeddings and AI models
- **LangChain** - AI framework
- **Anthropic Claude** - AI language model

## License

MIT
