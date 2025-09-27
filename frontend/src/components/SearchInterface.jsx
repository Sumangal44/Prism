import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, Send, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [searchHistory, setSearchHistory] = useState([
    "Show the report that mentions international development in 2024",
    "Find the screenshot taken at 14:32",
    "Summarize all customer complaints from voice recordings"
  ])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)])
      setQuery('')
      toast.success('Searching across all your content...')
    }
  }

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    if (!isListening) {
      toast.success('Voice search activated - speak your query')
      // Simulate voice recognition
      setTimeout(() => {
        setQuery("Find documents about budget allocation")
        setIsListening(false)
        toast.success('Voice query captured!')
      }, 3000)
    }
  }

  const suggestedQueries = [
    "Show me all documents from last week",
    "Find images with text about financial reports", 
    "Search for meeting recordings about project updates",
    "What are the key points from uploaded PDFs?"
  ]

  return (
    <div className="space-y-6">
      {/* Main Search Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="search-container"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Sparkles className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-semibold">Ask Prism Anything</h2>
        </div>
        
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search across documents, images, and audio..."
                className="input-field pl-12 pr-16 py-4 text-lg"
              />
              <button
                onClick={handleVoiceSearch}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="btn-primary flex items-center space-x-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Voice Recognition Feedback */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-red-700 font-medium">Listening... Speak your query now</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggested Queries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="search-container"
      >
        <h3 className="text-lg font-semibold mb-4">Suggested Queries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="text-left p-4 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-primary-200"
            >
              <p className="text-gray-700 hover:text-primary-700">{suggestion}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="search-container"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
          <div className="space-y-2">
            {searchHistory.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearch(search)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-primary-200"
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 hover:text-primary-700 truncate">{search}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SearchInterface