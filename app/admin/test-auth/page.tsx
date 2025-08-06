"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export default function TestAuth() {
  const { user, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && token) {
      // Test API call
      fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setApiTest(data))
      .catch(err => setApiTest({ error: err.message }));
    }
  }, [hasHydrated, isAuthenticated, token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Auth State:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({
              hasHydrated,
              isAuthenticated,
              user: user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              } : null,
              token: token ? `${token.substring(0, 20)}...` : null
            }, null, 2)}
          </pre>
        </div>

        {apiTest && (
          <div>
            <h2 className="text-lg font-semibold">API Test Result:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 