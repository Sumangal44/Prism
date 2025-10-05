/**
 * Advanced API Usage Examples with Axios
 * This file demonstrates how to use the enhanced axios API service
 */

import { api, apiClient } from './api';
import toast from 'react-hot-toast';

/**
 * Example: Upload document with progress tracking
 */
export const uploadWithProgress = async (file, onProgress = null) => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Use the lower-level apiClient for custom progress tracking
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload progress: ${progress}%`);
          
          // Call custom progress callback if provided
          if (onProgress) {
            onProgress(progress, progressEvent);
          }
        }
      }
    });
    
    return response; // This will be the response.data due to interceptor
    
  } catch (error) {
    console.error('Upload with progress failed:', error);
    throw error;
  }
};

/**
 * Example: Batch operations with error handling
 */
export const batchDeleteDocuments = async (fileIds) => {
  const results = [];
  
  for (const fileId of fileIds) {
    try {
      await api.deleteDocument(fileId);
      results.push({ fileId, success: true });
      toast.success(`Document ${fileId} deleted successfully`);
    } catch (error) {
      results.push({ fileId, success: false, error: error.message });
      toast.error(`Failed to delete ${fileId}: ${error.message}`);
    }
  }
  
  return results;
};

/**
 * Example: Question with timeout and retry
 */
export const askQuestionWithRetry = async (question, fileId = null, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for question: "${question}"`);
      
      const response = await api.askQuestion(question, fileId);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.error || 'Failed to get answer');
      }
      
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
};

/**
 * Example: Health check with status reporting
 */
export const performHealthCheck = async () => {
  try {
    const [healthResponse, modelStatus] = await Promise.all([
      api.healthCheck(),
      api.getModelStatus()
    ]);
    
    const status = {
      server: {
        online: true,
        response: healthResponse
      },
      model: {
        loaded: modelStatus.model_loaded,
        hardware: modelStatus.hardware_mode,
        details: modelStatus
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('🏥 Health check results:', status);
    return status;
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return {
      server: { online: false, error: error.message },
      model: { loaded: false, error: 'Could not check model status' },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Example: Document management utilities
 */
export const documentUtils = {
  /**
   * Get all documents with enhanced error handling
   */
  getAllDocuments: async () => {
    try {
      const response = await api.listDocuments();
      return response.success ? response.documents : [];
    } catch (error) {
      console.error('Failed to get documents:', error);
      toast.error(`Failed to load documents: ${error.message}`);
      return [];
    }
  },

  /**
   * Delete document with confirmation
   */
  deleteDocumentSafely: async (fileId) => {
    try {
      const result = await api.deleteDocument(fileId);
      toast.success(`Document deleted successfully`);
      return result;
    } catch (error) {
      console.error(`Failed to delete document ${fileId}:`, error);
      toast.error(`Failed to delete document: ${error.message}`);
      throw error;
    }
  },

  /**
   * Get document details with fallback
   */
  getDocumentDetails: async (fileId) => {
    try {
      return await api.getDocument(fileId);
    } catch (error) {
      console.warn(`Could not get details for document ${fileId}:`, error);
      return null;
    }
  }
};

/**
 * Example: API monitoring and logging
 */
export const apiMonitor = {
  // Track API call statistics
  stats: {
    calls: 0,
    errors: 0,
    totalResponseTime: 0,
    lastCall: null
  },

  /**
   * Wrapper for API calls with monitoring
   */
  monitoredCall: async (apiFunction, ...args) => {
    const startTime = Date.now();
    apiMonitor.stats.calls++;
    
    try {
      const result = await apiFunction(...args);
      const responseTime = Date.now() - startTime;
      apiMonitor.stats.totalResponseTime += responseTime;
      apiMonitor.stats.lastCall = { success: true, responseTime, timestamp: new Date() };
      
      console.log(`📊 API call completed in ${responseTime}ms`);
      return result;
      
    } catch (error) {
      apiMonitor.stats.errors++;
      const responseTime = Date.now() - startTime;
      apiMonitor.stats.lastCall = { 
        success: false, 
        error: error.message, 
        responseTime, 
        timestamp: new Date() 
      };
      
      console.error(`📊 API call failed after ${responseTime}ms:`, error);
      throw error;
    }
  },

  /**
   * Get performance statistics
   */
  getStats: () => ({
    ...apiMonitor.stats,
    averageResponseTime: apiMonitor.stats.calls > 0 
      ? apiMonitor.stats.totalResponseTime / apiMonitor.stats.calls 
      : 0,
    errorRate: apiMonitor.stats.calls > 0 
      ? (apiMonitor.stats.errors / apiMonitor.stats.calls) * 100 
      : 0
  })
};

export default {
  uploadWithProgress,
  batchDeleteDocuments,
  askQuestionWithRetry,
  performHealthCheck,
  documentUtils,
  apiMonitor
};