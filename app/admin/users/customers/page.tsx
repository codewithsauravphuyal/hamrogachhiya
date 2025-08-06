"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Users, 
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: 'customer';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  orderCount?: number;
  totalSpent?: number;
}

export default function AdminCustomers() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchCustomers();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      const response = await fetch('/api/admin/users?role=customer', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load customers');
      }
      
      const data = await response.json();
      setCustomers(data.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && customer.isActive) ||
                         (statusFilter === 'inactive' && !customer.isActive);
    return matchesSearch && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Manage Customers">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Manage Customers">
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
    <DashboardLayout title="Manage Customers">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Customers</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all customer accounts</p>
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
                    placeholder="Search customers..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Customers ({filteredCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Orders</th>
                      <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Verification</th>
                      <th className="text-left py-3 px-4 font-medium">Joined</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <ShoppingBag className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{customer.orderCount || 0} orders</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">${customer.totalSpent?.toFixed(2) || '0.00'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {customer.isActive ? (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <UserX className="w-4 h-4 text-red-500" />
                            )}
                            <span className={customer.isActive ? 'text-green-600' : 'text-red-600'}>
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {customer.isVerified ? (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <UserX className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className={customer.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                              {customer.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No customers found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
} 