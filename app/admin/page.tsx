"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Store, 
  TrendingUp, 
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalStores: number;
  totalRevenue: number;
  pendingOrders: number;
  activeUsers: number;
  activeProducts: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  store: {
    name: string;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
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
      
      // Fetch recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=5', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!ordersResponse.ok) {
        throw new Error('Failed to load orders');
      }
      
      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData.data || []);
      
      // Fetch recent products
      const productsResponse = await fetch('/api/admin/products?limit=5', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!productsResponse.ok) {
        throw new Error('Failed to load products');
      }
      
      const productsData = await productsResponse.json();
      setRecentProducts(productsData.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'packed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'packed': return <Package className="w-4 h-4" />;
      case 'shipped': return <ShoppingCart className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <DashboardContentSkeleton />
      </DashboardLayout>
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
            Here's what's happening with your e-commerce platform
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
                {stats?.activeUsers || 0} active users
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
                {stats?.activeProducts || 0} active products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingOrders || 0} pending orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                All time sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products/add">
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/orders/manage">
            <Button className="w-full" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Manage Orders
            </Button>
          </Link>
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

        {/* Recent Orders and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.user.name}</p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {getStatusIcon(order.status)}
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent orders</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Products</CardTitle>
                <Link href="/admin/products/add">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.store.name}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.price.toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
                {recentProducts.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent products</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}