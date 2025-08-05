"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Edit,
  Store,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  averageRating: number;
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
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
  images: string[];
}

export default function SellerDashboard() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to access the seller dashboard');
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'seller') {
      toast.error('You do not have permission to access the seller dashboard');
      router.push('/');
      return;
    }
    
    fetchDashboardData();
  }, [isAuthenticated, user, hasHydrated, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      // Fetch seller stats
      const statsResponse = await fetch('/api/seller/stats', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to load stats');
      }
      
      const statsData = await statsResponse.json();
      setStats({
        totalProducts: statsData.data.totalProducts || 0,
        totalOrders: statsData.data.totalOrders || 0,
        totalRevenue: statsData.data.totalRevenue || 0,
        pendingOrders: statsData.data.pendingOrders || 0,
        lowStockProducts: statsData.data.lowStock || 0,
        averageRating: statsData.data.rating || 0
      });
      
      // Fetch recent orders
      const ordersResponse = await fetch('/api/seller/orders?limit=5', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!ordersResponse.ok) {
        throw new Error('Failed to load orders');
      }
      
      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData.data || []);
      
      // Fetch low stock products
      const productsResponse = await fetch('/api/seller/products?limit=5&lowStock=true', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!productsResponse.ok) {
        throw new Error('Failed to load products');
      }
      
      const productsData = await productsResponse.json();
      setLowStockProducts(productsData.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Seller Dashboard">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <DashboardLayout title="Seller Dashboard">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!isAuthenticated ? 'Seller Dashboard' : 'Access Denied'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!isAuthenticated 
              ? 'Please login to access the seller dashboard.'
              : 'You don\'t have permission to access the seller dashboard.'
            }
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Seller Dashboard">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Seller Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your store and products
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active products
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
                {stats?.pendingOrders || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                All time sales
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/seller/products">
            <Button className="w-full" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link href="/seller/orders">
            <Button className="w-full" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Manage Orders
            </Button>
          </Link>
          <Link href="/seller/store">
            <Button className="w-full" variant="outline">
              <Store className="w-4 h-4 mr-2" />
              Store Settings
            </Button>
          </Link>
          <Link href="/seller/products/new">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">Stock: {product.stock}</p>
                    </div>
                    <Link href={`/seller/products/${product._id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/seller/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{order.orderNumber}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{order.user.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{order.user.email}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent orders</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Low Stock Products</p>
                    <p className="text-sm text-gray-600">Need attention</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats?.lowStockProducts || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Pending Orders</p>
                    <p className="text-sm text-gray-600">Awaiting action</p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.pendingOrders || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Average Rating</p>
                    <p className="text-sm text-gray-600">Customer satisfaction</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.averageRating?.toFixed(1) || '0.0'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}