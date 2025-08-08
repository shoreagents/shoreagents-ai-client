# ShoreAgents AI - Electron App

A modern Electron desktop application built with Next.js and Shadcn/ui.

## Features

- 🖥️ **Electron Desktop App** - Cross-platform desktop application
- ⚛️ **Next.js 15** - React framework with App Router
- 🎨 **Shadcn/ui** - Beautiful, accessible UI components
- 🎯 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 📊 **Dashboard** - Interactive dashboard with charts and data tables

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
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

## Technologies Used

- **Electron** - Desktop app framework
- **Next.js 15** - React framework
- **Shadcn/ui** - UI component library
- **Tailwind CSS v3** - CSS framework
- **TypeScript** - Type safety
- **Recharts** - Chart library
- **Lucide React** - Icons

## License

MIT
