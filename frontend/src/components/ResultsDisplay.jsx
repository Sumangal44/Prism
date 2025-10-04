import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Mic, ExternalLink, Star, Clock } from 'lucide-react'

const ResultsDisplay = ({ results }) => {
  if (!results || results.length === 0) {
    return null
  }

  const getIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />
      case 'audio':
        return <Mic className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getRelevanceColor = (score) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100'
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRelevanceLabel = (score) => {
    if (score >= 0.9) return 'Highly Relevant'
    if (score >= 0.7) return 'Relevant'
    return 'Somewhat Relevant'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="search-container"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Search Results ({results.length})
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Search completed in 2.3s</span>
        </div>
      </div>

      <div className="space-y-6">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 card-hover"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getIcon(result.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {result.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(result.relevanceScore)}`}>
                      {getRelevanceLabel(result.relevanceScore)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{result.relevanceScore.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {result.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <ExternalLink className="w-4 h-4" />
                      <span>{result.source}</span>
                    </span>
                    
                    {result.page && (
                      <span>Page {result.page}</span>
                    )}
                    
                    {result.timestamp && (
                      <span>Time {result.timestamp}</span>
                    )}
                    
                    {result.boundingBox && (
                      <span>Region ({result.boundingBox.x}, {result.boundingBox.y})</span>
                    )}
                  </div>
                  
                  {result.citations && result.citations.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Citations:</span>
                      <div className="flex space-x-1">
                        {result.citations.map((citation, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium"
                          >
                            [{citation}]
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {results.filter(r => r.type === 'document').length}
          </div>
          <div className="text-sm text-blue-600">Documents</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {results.filter(r => r.type === 'image').length}
          </div>
          <div className="text-sm text-green-600">Images</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {results.filter(r => r.type === 'audio').length}
          </div>
          <div className="text-sm text-purple-600">Audio Files</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResultsDisplay