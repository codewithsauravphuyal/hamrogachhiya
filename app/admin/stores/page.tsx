"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Store, 
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  User,
  Package,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface StoreData {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminStores() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchStores();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      const response = await fetch('/api/admin/stores', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load stores');
      }
      
      const data = await response.json();
      setStores(data.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && store.isActive) ||
                         (statusFilter === 'inactive' && !store.isActive);
    return matchesSearch && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Manage Stores">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Manage Stores">
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
    <DashboardLayout title="Manage Stores">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Stores</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all seller stores</p>
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
                    placeholder="Search stores or sellers..."
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

        {/* Stores List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Store className="w-5 h-5 mr-2" />
                      {store.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {store.isVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        store.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Store Info */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {store.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {store.seller.name}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Package className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-lg font-semibold">{store.totalProducts}</p>
                        <p className="text-xs text-gray-500">Products</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Store className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-lg font-semibold">{store.totalOrders}</p>
                        <p className="text-xs text-gray-500">Orders</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <p className="text-lg font-semibold">{store.rating.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-xl font-bold text-green-600">
                        ${store.totalRevenue.toFixed(2)}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{store.address.street}</p>
                      <p>{store.address.city}, {store.address.state} {store.address.zipCode}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          {store.isVerified ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredStores.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No stores found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'No stores have been registered yet'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 