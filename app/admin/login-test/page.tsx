"use client";

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

export default function LoginTest() {
  const { login, user, isAuthenticated, hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Use test login API
      const response = await fetch('/api/auth/test-login?email=admin@admin.com');
      const data = await response.json();
      
      if (data.success) {
        // Set the token and user in auth store
        useAuthStore.getState().setToken(data.token);
        useAuthStore.getState().updateUser(data.user);
        useAuthStore.setState({ 
          user: data.user, 
          token: data.token, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        setResult({ success: true, message: 'Login successful', data });
      } else {
        setResult({ success: false, message: 'Login failed', data });
      }
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      setResult({ success: false, message: 'Error occurred', error: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Current Auth State:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({
              hasHydrated,
              isAuthenticated,
              user: user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              } : null
            }, null, 2)}
          </pre>
        </div>

        <Button 
          onClick={handleTestLogin} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Logging in...' : 'Test Login as Admin'}
        </Button>

        {result && (
          <div>
            <h2 className="text-lg font-semibold">Login Result:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-4">
            <a href="/admin" className="text-blue-600 hover:underline">
              Go to Admin Dashboard →
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 