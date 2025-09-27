import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image, Mic, ExternalLink, Play, Eye, Star, Clock, MapPin, ChevronDown, ChevronRight } from 'lucide-react'

const ResultsDisplay = ({ results }) => {
  const [expandedResult, setExpandedResult] = useState(null)
  const [sortBy, setSortBy] = useState('relevance')

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5 text-red-500" />
      case 'image': return <Image className="w-5 h-5 text-blue-500" />
      case 'audio': return <Mic className="w-5 h-5 text-green-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'document': return 'bg-red-100 border-red-200 text-red-800'
      case 'image': return 'bg-blue-100 border-blue-200 text-blue-800'
      case 'audio': return 'bg-green-100 border-green-200 text-green-800'
      default: return 'bg-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getRelevanceColor = (score) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleSourceClick = (result) => {
    if (result.type === 'document') {
      window.open(`/view/${result.source}?page=${result.page}`, '_blank')
    } else if (result.type === 'image') {
      window.open(`/view/${result.source}`, '_blank')
    } else if (result.type === 'audio') {
      // Play audio at timestamp
      console.log(`Playing ${result.source} at ${result.timestamp}`)
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore
    if (sortBy === 'type') return a.type.localeCompare(b.type)
    return 0
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="search-container"
    >
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-gray-600">Found {results.length} results across all content types</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {sortedResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 card-hover"
          >
            <div className="flex items-start space-x-4">
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(result.type)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{result.source}</span>
                      </div>
                      
                      {result.page && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>Page {result.page}</span>
                        </div>
                      )}
                      
                      {result.timestamp && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{result.timestamp}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Star className={`w-4 h-4 ${getRelevanceColor(result.relevanceScore)}`} />
                        <span className={getRelevanceColor(result.relevanceScore)}>
                          {(result.relevanceScore * 100).toFixed(0)}% match
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedResult === result.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>

                {/* Preview Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{result.content}</p>
                </div>

                {/* Citations */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Citations:</span>
                  {result.citations.map((citation, citIndex) => (
                    <span
                      key={citIndex}
                      className="inline-flex items-center justify-center w-6 h-6 bg-primary-500 text-white text-xs font-medium rounded-full"
                    >
                      {citation}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleSourceClick(result)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
                  </button>
                  
                  {result.type === 'audio' && (
                    <button className="btn-secondary flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Play Audio</span>
                    </button>
                  )}
                  
                  {result.type === 'image' && (
                    <button className="btn-secondary flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View Image</span>
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedResult === result.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-4 mt-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>File size: {Math.random() * 5 + 1} MB</div>
                            <div>Last modified: {new Date().toLocaleDateString()}</div>
                            <div>Language: English</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Related Content</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">Related document: report_2024_summary.pdf</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Image className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">Related image: chart_budget.png</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {result.boundingBox && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Image Region</h4>
                          <p className="text-sm text-gray-600">
                            Located at coordinates: ({result.boundingBox.x}, {result.boundingBox.y}) 
                            with size {result.boundingBox.width}×{result.boundingBox.height}px
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Search Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {results.filter(r => r.type === 'document').length}
            </div>
            <div className="text-sm text-gray-600">Documents Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.filter(r => r.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Images Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {results.filter(r => r.type === 'audio').length}
            </div>
            <div className="text-sm text-gray-600">Audio Files Found</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResultsDisplay