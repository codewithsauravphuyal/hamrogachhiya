"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Users, 
  Package, 
  Store, 
  TrendingUp, 
  DollarSign,
  Star,
  Eye,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalStores: number;
  totalRevenue: number;
  activeUsers: number;
  activeProducts: number;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  monthlyGrowth: {
    users: number;
    products: number;
    revenue: number;
  };
}

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  views: number;
  likes: number;
  rating: number;
  store: {
    name: string;
  };
}

interface RecentActivity {
  _id: string;
  type: 'user_registered' | 'product_added' | 'store_approved' | 'order_placed';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to access the admin dashboard');
      return;
    }
    
    if (user?.role !== 'admin') {
      toast.error('You do not have permission to access the admin dashboard');
      return;
    }
    
    fetchDashboardData();
  }, [isAuthenticated, user, hasHydrated]);

  // Auto-login for testing if not authenticated
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      const autoLogin = async () => {
        try {
          const response = await fetch('/api/auth/test-login?email=admin@admin.com');
          const data = await response.json();
          
          if (data.success) {
            useAuthStore.setState({ 
              user: data.user, 
              token: data.token, 
              isAuthenticated: true, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      };
      
      autoLogin();
    }
  }, [hasHydrated, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to load stats');
      }
      
      const statsData = await statsResponse.json();
      setStats(statsData.data);
      
      // Fetch recent products
      const productsResponse = await fetch('/api/admin/products?limit=5', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!productsResponse.ok) {
        throw new Error('Failed to load products');
      }
      
      const productsData = await productsResponse.json();
      setRecentProducts(productsData.data || []);
      
      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity?limit=5', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!activityResponse.ok) {
        throw new Error('Failed to load activity');
      }
      
      const activityData = await activityResponse.json();
      setRecentActivity(activityData.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return <Users className="w-4 h-4" />;
      case 'product_added': return <Package className="w-4 h-4" />;
      case 'store_approved': return <Store className="w-4 h-4" />;
      case 'order_placed': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered': return 'text-blue-600 bg-blue-100';
      case 'product_added': return 'text-green-600 bg-green-100';
      case 'store_approved': return 'text-purple-600 bg-purple-100';
      case 'order_placed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!hasHydrated) {
    return (
      <AdminLayout title="Admin Dashboard">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!isAuthenticated ? 'Admin Dashboard' : 'Access Denied'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!isAuthenticated 
              ? 'Please login to access the admin dashboard.'
              : 'You don\'t have permission to access the admin dashboard.'
            }
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your e-commerce platform today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeUsers || 0} active • +{stats?.monthlyGrowth?.users || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeProducts || 0} active • +{stats?.monthlyGrowth?.products || 0} this month
              </p>
            </CardContent>
          </Card>

                     <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
               <DollarSign className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">रू {stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
               <p className="text-xs text-muted-foreground">
                 +{stats?.monthlyGrowth?.revenue || 0}% this month
               </p>
             </CardContent>
           </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalLikes || 0} likes • {stats?.averageRating?.toFixed(1) || '0.0'} avg rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStores || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active stores on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/users/manage">
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/stores">
            <Button className="w-full" variant="outline">
              <Store className="w-4 h-4 mr-2" />
              Manage Stores
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Link href="/admin/activity">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}