/**
 * API Testing Component
 * This component demonstrates various axios API features and can be used for testing
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Activity,
  Upload,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiClient } from '../services/api';
import { performHealthCheck, uploadWithProgress, apiMonitor } from '../services/apiExamples';

const ApiTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiStats, setApiStats] = useState(apiMonitor.getStats());
  const [testResults, setTestResults] = useState([]);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setApiStats(apiMonitor.getStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const addTestResult = (test, success, message, data = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    
    if (success) {
      toast.success(`✅ ${test}: ${message}`);
    } else {
      toast.error(`❌ ${test}: ${message}`);
    }
  };

  const testHealthCheck = async () => {
    setIsLoading(true);
    try {
      const status = await performHealthCheck();
      setHealthStatus(status);
      
      if (status.server.online && status.model.loaded) {
        addTestResult('Health Check', true, 'System is healthy', status);
      } else {
        addTestResult('Health Check', false, 'System has issues', status);
      }
    } catch (error) {
      addTestResult('Health Check', false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testDocumentList = async () => {
    setIsLoading(true);
    try {
      const data = await apiMonitor.monitoredCall(api.listDocuments);
      addTestResult(
        'List Documents', 
        true, 
        `Found ${data.documents?.length || 0} documents`,
        data
      );
    } catch (error) {
      addTestResult('List Documents', false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const result = await uploadWithProgress(file, (progress) => {
        setUploadProgress(progress);
      });

      addTestResult(
        'File Upload',
        true,
        `Uploaded ${file.name} successfully`,
        result
      );
    } catch (error) {
      addTestResult('File Upload', false, error.message);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      event.target.value = ''; // Reset file input
    }
  };

  const testQuestionAPI = async () => {
    setIsLoading(true);
    try {
      const question = "What is this document about?";
      const data = await apiMonitor.monitoredCall(api.askQuestion, question);
      
      addTestResult(
        'Ask Question',
        data.success,
        data.success ? 'Got response from LLM' : data.error,
        data
      );
    } catch (error) {
      addTestResult('Ask Question', false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testModelStatus = async () => {
    setIsLoading(true);
    try {
      const data = await apiMonitor.monitoredCall(api.getModelStatus);
      addTestResult(
        'Model Status',
        true,
        `Model is ${data.model_loaded ? 'loaded' : 'not loaded'}`,
        data
      );
    } catch (error) {
      addTestResult('Model Status', false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    toast.success('Test results cleared');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="text-blue-500" />
          API Testing Dashboard
        </h2>

        {/* API Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Total Calls</div>
            <div className="text-2xl font-bold text-blue-800">{apiStats.calls}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600">Errors</div>
            <div className="text-2xl font-bold text-red-800">{apiStats.errors}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Avg Response</div>
            <div className="text-2xl font-bold text-green-800">
              {Math.round(apiStats.averageResponseTime)}ms
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">Success Rate</div>
            <div className="text-2xl font-bold text-purple-800">
              {Math.round(100 - apiStats.errorRate)}%
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testHealthCheck}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            <Activity size={16} />
            Health Check
          </button>

          <button
            onClick={testDocumentList}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <PlayCircle size={16} />
            List Documents
          </button>

          <button
            onClick={testQuestionAPI}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            <MessageSquare size={16} />
            Ask Question
          </button>

          <button
            onClick={testModelStatus}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <Activity size={16} />
            Model Status
          </button>

          <label className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 cursor-pointer">
            <Upload size={16} />
            Upload Test
            <input
              type="file"
              onChange={testFileUpload}
              accept=".pdf,.docx"
              className="hidden"
            />
          </label>

          <button
            onClick={clearResults}
            className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Clear Results
          </button>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
            <Loader2 className="animate-spin" size={20} />
            <span>Running test...</span>
          </div>
        )}
      </motion.div>

      {/* Test Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4">Test Results</h3>
        
        {testResults.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No test results yet. Run some tests to see results here.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div 
                key={result.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="text-green-600 mt-0.5" size={16} />
                ) : (
                  <XCircle className="text-red-600 mt-0.5" size={16} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{result.test}</h4>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        View Response Data
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Health Status */}
      {healthStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4">System Health Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${healthStatus.server.online ? 'bg-green-50' : 'bg-red-50'}`}>
              <h4 className="font-medium flex items-center gap-2">
                {healthStatus.server.online ? (
                  <CheckCircle className="text-green-600" size={16} />
                ) : (
                  <XCircle className="text-red-600" size={16} />
                )}
                Backend Server
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {healthStatus.server.online ? 'Online and responding' : 'Offline or unreachable'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${healthStatus.model.loaded ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <h4 className="font-medium flex items-center gap-2">
                {healthStatus.model.loaded ? (
                  <CheckCircle className="text-green-600" size={16} />
                ) : (
                  <XCircle className="text-yellow-600" size={16} />
                )}
                LLM Model
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {healthStatus.model.loaded 
                  ? `Loaded (${healthStatus.model.hardware} mode)` 
                  : 'Not loaded or unavailable'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ApiTester;