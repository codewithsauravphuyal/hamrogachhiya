"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginResult, setLoginResult] = useState<any>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test simple API first
      console.log('🔍 Testing simple API...');
      const simpleResponse = await fetch('/api/simple-test');
      const simpleData = await simpleResponse.json();
      
      if (!simpleResponse.ok) {
        setError(`Simple API test failed: ${simpleData.error}`);
        setLoading(false);
        return;
      }
      
      console.log('✅ Simple API test passed:', simpleData);
      
      // Test database connection
      console.log('🔍 Testing database connection...');
      const dbResponse = await fetch('/api/connection-test');
      const dbData = await dbResponse.json();
      
      if (!dbResponse.ok) {
        setError(`Database connection failed: ${dbData.error}`);
        setLoading(false);
        return;
      }
      
      console.log('✅ Database connection test passed:', dbData);
      
      // Test main API
      console.log('🔍 Testing main API...');
      const response = await fetch('/api/test');
      const data = await response.json();
      
      if (response.ok) {
        setTestResult({ 
          simple: simpleData, 
          connection: dbData, 
          main: data 
        });
      } else {
        setError(data.error || 'Main API test failed');
      }
    } catch (err) {
      console.error('❌ Test error:', err);
      setError('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  const testLogin = async () => {
    setLoginLoading(true);
    setLoginResult(null);
    try {
      console.log('🔍 Testing login...');
      const response = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@admin.com',
          password: 'admin123'
        }),
      });
      
      const data = await response.json();
      console.log('📡 Login test response:', data);
      
      if (response.ok) {
        setLoginResult(data);
      } else {
        setLoginResult({ error: data.error });
      }
    } catch (err) {
      console.error('❌ Login test error:', err);
      setLoginResult({ error: 'Login test failed' });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button 
                onClick={testApi} 
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test API Connection'}
              </Button>
              
              <Button 
                onClick={testLogin} 
                disabled={loginLoading}
                variant="outline"
              >
                {loginLoading ? 'Testing...' : 'Test Login'}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-semibold">Error:</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {testResult && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-semibold">✅ All Tests Passed!</h3>
                  <p className="text-green-600">API and database are working correctly.</p>
                </div>
                
                {/* Simple API Test */}
                <div>
                  <h3 className="font-semibold mb-2">Simple API Test:</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(testResult.simple, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Database Connection Test */}
                <div>
                  <h3 className="font-semibold mb-2">Database Connection Test:</h3>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(testResult.connection, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* Main API Test */}
                {testResult.main && (
                  <div>
                    <h3 className="font-semibold mb-2">Main API Test:</h3>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(testResult.main, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Login Test Results */}
            {loginResult && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Login Test Results:</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(loginResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 