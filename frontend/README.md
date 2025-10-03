# Prism - Multimodal RAG Frontend

A beautiful, modern frontend for the Prism Multimodal Retrieval-Augmented Generation system built with React and Tailwind CSS.

## Features

- 🔍 **Intelligent Search Interface** - Natural language queries across documents, images, and audio
- 📤 **Drag & Drop Upload** - Easy file upload with real-time processing feedback  
- 🎯 **Multimodal Results** - Unified display of search results across all content types
- 🏷️ **Smart Citations** - Transparent source linking with numbered references
- 🎨 **Modern Design** - Beautiful UI with smooth animations and responsive design
- 🔒 **Privacy First** - All processing happens locally, no cloud dependencies
- 🎙️ **Voice Search** - Speak your queries naturally
- ⚡ **Real-time Processing** - Live feedback during file upload and processing

## Supported File Types

- **Documents**: PDF, DOCX
- **Images**: JPG, PNG, GIF, BMP, WebP
- **Audio**: MP3, WAV, M4A, AAC, OGG

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with branding
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── SearchInterface.jsx # Main search component
│   │   ├── FileUpload.jsx      # File upload with drag & drop
│   │   └── ResultsDisplay.jsx  # Search results display
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

## Key Components

### SearchInterface
- Natural language search box
- Voice search capability
- Suggested queries
- Recent search history

### FileUpload  
- Drag and drop file upload
- Real-time processing feedback
- Batch file processing
- File type validation

### ResultsDisplay
- Multimodal search results
- Citation system with source links
- Relevance scoring
- Expandable result details

## Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon system
- **React Dropzone** - File upload functionality
- **React Hot Toast** - Elegant notifications

## Responsive Design

The interface is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## Backend Integration

This frontend is designed to work with the Prism backend API. Update the API endpoints in the components to connect to your backend server.

Expected API endpoints:
- `POST /api/upload` - File upload
- `POST /api/search` - Search query
- `GET /api/files` - List uploaded files
- `GET /api/view/:filename` - View/download files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details