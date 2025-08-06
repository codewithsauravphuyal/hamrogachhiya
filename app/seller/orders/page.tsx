"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  ShoppingCart, 
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export default function SellerOrders() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to access the seller dashboard');
      return;
    }
    
    if (user?.role !== 'seller') {
      toast.error('You do not have permission to access the seller dashboard');
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      const response = await fetch('/api/seller/orders', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load orders');
      }
      
      const data = await response.json();
      setOrders(data.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'packed': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return AlertCircle;
      case 'refunded': return AlertCircle;
      default: return Clock;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasHydrated) {
    return (
      <DashboardLayout title="My Orders">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <DashboardLayout title="My Orders">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!isAuthenticated ? 'My Orders' : 'Access Denied'}
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
      <DashboardLayout title="My Orders">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer orders for your products
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5 text-gray-600" />
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Customer</h3>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.user.name}</p>
                        <p className="text-sm text-gray-600">{order.user.email}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {item.product.images && item.product.images[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">${item.total.toFixed(2)}</p>
                              <p className="text-xs text-gray-600">${item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Subtotal: ${order.subtotal.toFixed(2)}</p>
                        {order.tax > 0 && <p className="text-sm text-gray-600">Tax: ${order.tax.toFixed(2)}</p>}
                        {order.deliveryFee > 0 && <p className="text-sm text-gray-600">Delivery: ${order.deliveryFee.toFixed(2)}</p>}
                        {order.discount > 0 && <p className="text-sm text-gray-600">Discount: -${order.discount.toFixed(2)}</p>}
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Total: ${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm Order
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm">
                            <Package className="w-4 h-4 mr-1" />
                            Mark Packed
                          </Button>
                        )}
                        {order.status === 'packed' && (
                          <Button size="sm">
                            <Truck className="w-4 h-4 mr-1" />
                            Ship Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Orders from your products will appear here.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 