import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import SearchInterface from './components/SearchInterface'
import FileUpload from './components/FileUpload'
import ResultsDisplay from './components/ResultsDisplay'
import Sidebar from './components/Sidebar'
import { Search, Upload, FileText, Image, Mic, Brain } from 'lucide-react'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('search')

  const handleSearch = async (query) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          type: 'document',
          title: 'International Development Report 2024',
          content: 'This report discusses the key aspects of international development initiatives...',
          source: 'doc_2024.pdf',
          page: 7,
          citations: [1, 2],
          relevanceScore: 0.95
        },
        {
          id: 2,
          type: 'audio',
          title: 'Meeting Recording - Budget Discussion',
          content: 'Budget allocation for 2023 projects was discussed in detail...',
          source: 'meeting_20240301.wav',
          timestamp: '00:14:32',
          citations: [3],
          relevanceScore: 0.87
        },
        {
          id: 3,
          type: 'image',
          title: 'Account Statement Screenshot',
          content: 'Screenshot showing account details and transaction history...',
          source: 'screenshot_1432.png',
          boundingBox: { x: 120, y: 80, width: 300, height: 200 },
          citations: [4],
          relevanceScore: 0.82
        }
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files])
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <Header />
        
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 p-6 ml-64">
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center animate-float">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h1 className="text-5xl font-bold gradient-text mb-4">
                  Welcome to Prism
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Your intelligent multimodal search companion. Find insights across documents, images, and audio with natural language queries.
                </p>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'search' && (
                  <div className="space-y-8">
                    <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
                    {searchResults.length > 0 && (
                      <ResultsDisplay results={searchResults} />
                    )}
                  </div>
                )}

                {activeTab === 'upload' && (
                  <FileUpload onFileUpload={handleFileUpload} uploadedFiles={uploadedFiles} />
                )}

                {activeTab === 'files' && (
                  <div className="search-container">
                    <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>
                    {uploadedFiles.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No files uploaded yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 card-hover">
                            <div className="flex items-center space-x-3">
                              {file.type.includes('image') && <Image className="w-8 h-8 text-blue-500" />}
                              {file.type.includes('audio') && <Mic className="w-8 h-8 text-green-500" />}
                              {file.type.includes('pdf') && <FileText className="w-8 h-8 text-red-500" />}
                              <div>
                                <h3 className="font-medium truncate">{file.name}</h3>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App