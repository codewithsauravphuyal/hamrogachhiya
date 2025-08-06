"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminSidebar } from './admin-sidebar';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Bell, 
  MessageSquare,
  Search,
  Users,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function AdminLayout({ 
  children, 
  title = "Admin Dashboard",
  showHeader = true 
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, hasHydrated, logout } = useAuthStore();
  const router = useRouter();

  // Admin access control
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You do not have permission to access the admin dashboard.
            </p>
            <Link href="/">
              <Button variant="brand">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-screen bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Admin Sidebar Content */}
          <AdminSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Header */}
        {showHeader && (
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h1>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search */}
                <div className="hidden sm:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* Admin User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Administrator
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="p-4 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
} 