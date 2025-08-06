"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminRouteGuard({ children, fallback }: AdminRouteGuardProps) {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to access the admin dashboard');
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      toast.error('You do not have permission to access the admin dashboard');
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, hasHydrated, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to access the admin dashboard.
          </p>
          <div className="space-y-3">
            <Link href="/login">
              <Button variant="brand" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You do not have permission to access the admin dashboard. 
            Only administrators can view this page.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button variant="brand" className="w-full">
                Go Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Render children if user is authenticated and is admin
  return <>{children}</>;
} 