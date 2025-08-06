"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function AdminTest() {
  const { user, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Admin Stats API
      console.log('Testing admin stats API...');
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      results.stats = {
        status: statsResponse.status,
        ok: statsResponse.ok,
        data: statsResponse.ok ? await statsResponse.json() : null
      };

      // Test 2: Admin Orders API
      console.log('Testing admin orders API...');
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      results.orders = {
        status: ordersResponse.status,
        ok: ordersResponse.ok,
        data: ordersResponse.ok ? await ordersResponse.json() : null
      };

      // Test 3: Admin Products API
      console.log('Testing admin products API...');
      const productsResponse = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      results.products = {
        status: productsResponse.status,
        ok: productsResponse.ok,
        data: productsResponse.ok ? await productsResponse.json() : null
      };

      // Test 4: Test Login API
      console.log('Testing test login API...');
      const loginResponse = await fetch('/api/auth/test-login?email=admin@admin.com');
      results.login = {
        status: loginResponse.status,
        ok: loginResponse.ok,
        data: loginResponse.ok ? await loginResponse.json() : null
      };

      setTestResults(results);
      toast.success('Tests completed successfully!');
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Tests failed');
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated) {
    return (
      <AdminLayout title="Admin Test">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Admin Test">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Test">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin API Test</h1>
          <p className="text-gray-600 dark:text-gray-400">Test all admin API endpoints</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>User:</strong> {user?.name} ({user?.email})</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={runTests} disabled={loading}>
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            
            {Object.entries(testResults).map(([testName, result]: [string, any]) => (
              <Card key={testName}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {testName.charAt(0).toUpperCase() + testName.slice(1)} API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Success:</strong> {result.ok ? '✅ Yes' : '❌ No'}</p>
                    {result.data && (
                      <div>
                        <strong>Response:</strong>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 