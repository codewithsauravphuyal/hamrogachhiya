"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Edit,
  Eye,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
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
  total: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const orderStatuses = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
];

export default function AdminManageOrders() {
  const { user, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleEditClick = (order: Order) => {
    setEditingOrder(order._id);
    setEditStatus(order.status);
  };

  const handleEditCancel = () => {
    setEditingOrder(null);
    setEditStatus('');
  };

  const handleStatusUpdate = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          status: editStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order status updated successfully');
      setEditingOrder(null);
      setEditStatus('');
      fetchOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update order status');
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
      case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'packed': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Manage Orders">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Manage Orders">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">Update order status and manage customer orders</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id}>
                <CardContent className="pt-6">
                  {editingOrder === order._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Customer: {order.user.name} ({order.user.email})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Order Status
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                          >
                            {orderStatuses.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Payment Status
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleStatusUpdate(order._id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Order Display
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Customer: {order.user.name} ({order.user.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(order.status)}
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Order Items ({order.items.length})</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                  ) : (
                                    <Package className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.product.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium text-sm">${item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(order)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'No orders have been placed yet'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 