import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Image, Mic, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const FileUpload = ({ onFileUpload, uploadedFiles }) => {
  const [uploading, setUploading] = useState(false)
  const [processingFiles, setProcessingFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setUploading(true)
    setProcessingFiles(acceptedFiles.map(file => ({ 
      ...file, 
      status: 'processing',
      progress: 0 
    })))

    // Simulate file processing
    acceptedFiles.forEach((file, index) => {
      setTimeout(() => {
        setProcessingFiles(prev => 
          prev.map((f, i) => 
            i === index ? { ...f, status: 'completed', progress: 100 } : f
          )
        )
        
        if (index === acceptedFiles.length - 1) {
          setTimeout(() => {
            onFileUpload(acceptedFiles)
            setUploading(false)
            setProcessingFiles([])
            toast.success(`Successfully processed ${acceptedFiles.length} file(s)`)
          }, 500)
        }
      }, (index + 1) * 2000)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingFiles(prev => 
          prev.map((f, i) => {
            if (i === index && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          })
        )
      }, 200)

      setTimeout(() => clearInterval(progressInterval), 1800)
    })
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  })

  const getFileIcon = (type) => {
    if (type.includes('image')) return <Image className="w-6 h-6 text-blue-500" />
    if (type.includes('audio')) return <Mic className="w-6 h-6 text-green-500" />
    return <FileText className="w-6 h-6 text-red-500" />
  }

  const getFileTypeColor = (type) => {
    if (type.includes('image')) return 'bg-blue-100 border-blue-300'
    if (type.includes('audio')) return 'bg-green-100 border-green-300'
    return 'bg-red-100 border-red-300'
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="search-container"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
          <Upload className="w-8 h-8 text-primary-500" />
          <span>Upload Files</span>
        </h2>

        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary-500 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                ${isDragActive ? 'bg-primary-500 animate-bounce' : 'bg-gray-100'}
              `}>
                <Upload className={`w-10 h-10 ${isDragActive ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </div>
            
            <div>
              <p className={`text-xl font-semibold ${isDragActive ? 'text-primary-700' : 'text-gray-700'}`}>
                {isDragActive ? 'Drop your files here!' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-500 mt-2">
                or <span className="text-primary-600 font-medium">browse files</span>
              </p>
            </div>

            <div className="flex justify-center space-x-8 mt-6">
              <div className="text-center">
                <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-xs text-gray-400">PDF, DOCX</p>
              </div>
              <div className="text-center">
                <Image className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Images</p>
                <p className="text-xs text-gray-400">JPG, PNG, GIF</p>
              </div>
              <div className="text-center">
                <Mic className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Audio</p>
                <p className="text-xs text-gray-400">MP3, WAV, M4A</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Maximum file size: 100MB. All files are processed locally and never leave your device.
        </p>
      </motion.div>

      {/* Processing Files */}
      <AnimatePresence>
        {processingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="search-container"
          >
            <h3 className="text-lg font-semibold mb-4">Processing Files</h3>
            <div className="space-y-3">
              {processingFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{file.progress}%</span>
                    </div>
                  </div>
                  <div>
                    {file.status === 'processing' && <Loader className="w-5 h-5 text-primary-500 animate-spin" />}
                    {file.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-container"
        >
          <h3 className="text-lg font-semibold mb-4">Recently Uploaded</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.slice(-6).map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 card-hover ${getFileTypeColor(file.type)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(file.type)}
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-medium truncate mb-1">{file.name}</h4>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Processed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upload Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="search-container bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200"
      >
        <h3 className="text-lg font-semibold mb-4 text-primary-900">Upload Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Supported Formats</p>
                <p className="text-sm text-gray-600">PDF, DOCX, JPG, PNG, MP3, WAV, M4A</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Batch Upload</p>
                <p className="text-sm text-gray-600">Select multiple files at once for faster processing</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Privacy First</p>
                <p className="text-sm text-gray-600">All processing happens locally on your device</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Smart Indexing</p>
                <p className="text-sm text-gray-600">Files are automatically indexed for instant search</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default FileUpload