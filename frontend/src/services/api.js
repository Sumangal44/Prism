/**
 * API Configuration with Axios
 */
import axios from 'axios';

// Base API URL - uses relative path to leverage Vite proxy in development
const API_BASE_URL = import.meta.env.PROD ? 'http://localhost:8000' : '';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth (if needed later)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    return response.data; // Return only the data portion
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Enhanced error handling
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      errorMessage = data?.detail || data?.message || `HTTP ${status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error - please check your connection and ensure the backend server is running';
    } else {
      // Other error
      errorMessage = error.message || 'Request failed';
    }
    
    // Create a more informative error object
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    
    return Promise.reject(enhancedError);
  }
);

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Document endpoints
  uploadDocument: '/api/upload',
  listDocuments: '/api/documents',
  getDocument: (fileId) => `/api/documents/${fileId}`,
  deleteDocument: (fileId) => `/api/documents/${fileId}`,
  
  // Q&A endpoints
  askQuestion: '/api/question',
  
  // Model endpoints
  modelStatus: '/api/model/status',
  toggleHardware: '/api/model/toggle-hardware',
  
  // Health check
  health: '/'
};

/**
 * API functions using axios
 */
export const api = {
  // Document operations
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(API_ENDPOINTS.uploadDocument, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Progress callback for file uploads
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload progress: ${progress}%`);
        }
      }
    });
  },

  listDocuments: () => 
    apiClient.get(API_ENDPOINTS.listDocuments),

  getDocument: (fileId) => 
    apiClient.get(API_ENDPOINTS.getDocument(fileId)),

  deleteDocument: (fileId) => 
    apiClient.delete(API_ENDPOINTS.deleteDocument(fileId)),

  // Q&A operations
  askQuestion: (question, fileId = null) => 
    apiClient.post(API_ENDPOINTS.askQuestion, { 
      question, 
      file_id: fileId 
    }),

  // Model operations
  getModelStatus: () => 
    apiClient.get(API_ENDPOINTS.modelStatus),

  toggleHardware: () => 
    apiClient.post(API_ENDPOINTS.toggleHardware),

  // Health check
  healthCheck: () => 
    apiClient.get(API_ENDPOINTS.health)
};

// Export axios instance for direct use if needed
export { apiClient };

export default api;