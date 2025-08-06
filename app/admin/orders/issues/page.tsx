"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  ShoppingCart, 
  AlertTriangle,
  Search,
  Filter,
  Edit,
  CheckCircle,
  XCircle,
  User,
  Package,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface OrderIssue {
  _id: string;
  orderNumber: string;
  issueType: 'delivery' | 'quality' | 'refund' | 'damage' | 'missing';
  issueDescription: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  order: {
    _id: string;
    total: number;
    status: string;
    items: Array<{
      product: {
        name: string;
        price: number;
      };
      quantity: number;
    }>;
  };
  createdAt: string;
}

export default function AdminOrderIssues() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [orderIssues, setOrderIssues] = useState<OrderIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchOrderIssues();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchOrderIssues = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      // Mock order issues for demonstration
      const mockOrderIssues: OrderIssue[] = [
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          issueType: 'delivery',
          issueDescription: 'Order was not delivered on the promised date. Customer is requesting compensation.',
          status: 'open',
          priority: 'high',
          reportedAt: new Date().toISOString(),
          user: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          order: {
            _id: 'order1',
            total: 45.99,
            status: 'delivered',
            items: [
              {
                product: {
                  name: 'Fresh Milk',
                  price: 3.99
                },
                quantity: 2
              }
            ]
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          issueType: 'quality',
          issueDescription: 'Product received was damaged and not as described. Customer wants a refund.',
          status: 'in_progress',
          priority: 'urgent',
          reportedAt: new Date().toISOString(),
          user: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          order: {
            _id: 'order2',
            total: 29.99,
            status: 'delivered',
            items: [
              {
                product: {
                  name: 'Organic Apples',
                  price: 4.99
                },
                quantity: 1
              }
            ]
          },
          createdAt: new Date().toISOString()
        }
      ];
      setOrderIssues(mockOrderIssues);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load order issues');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = orderIssues.filter(issue => {
    const matchesSearch = issue.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!hasHydrated) {
    return (
      <AdminLayout title="Order Issues">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Order Issues">
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
    <AdminLayout title="Order Issues">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Issues</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and resolve customer order issues and complaints</p>
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
                    placeholder="Search order issues..."
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
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Issues List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <Card key={issue._id} className="border-l-4 border-orange-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      {issue.orderNumber}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Issue Info */}
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        {issue.user.name} ({issue.user.email})
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-800 dark:text-orange-200">
                              {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)} Issue
                            </h4>
                            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                              {issue.issueDescription}
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                              Reported on {new Date(issue.reportedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Order Details</h4>
                      <div className="space-y-2">
                        {issue.order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span>रू {(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>${issue.order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Contact Customer
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Update Status
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline" className="text-gray-600 hover:text-gray-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredIssues.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No order issues found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No order issues have been reported'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 