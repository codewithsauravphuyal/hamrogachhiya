"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Package, 
  AlertTriangle,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Store,
  Flag,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface ReportedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  reportReason: string;
  reportCount: number;
  reportedAt: string;
  store: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function AdminReportedProducts() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [reportedProducts, setReportedProducts] = useState<ReportedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchReportedProducts();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchReportedProducts = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      // For now, we'll use the regular products API and filter reported ones
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load reported products');
      }
      
      const data = await response.json();
      // Mock reported products for demonstration
      const mockReportedProducts: ReportedProduct[] = [
        {
          _id: '1',
          name: 'Fake Product',
          description: 'This product has been reported for being fake or counterfeit',
          price: 29.99,
          stock: 10,
          images: [],
          isActive: true,
          reportReason: 'Counterfeit product, misleading description',
          reportCount: 3,
          reportedAt: new Date().toISOString(),
          store: {
            _id: 'store1',
            name: 'Suspicious Store'
          },
          createdAt: new Date().toISOString()
        }
      ];
      setReportedProducts(mockReportedProducts);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load reported products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = reportedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <AdminLayout title="Reported Products">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Reported Products">
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
    <AdminLayout title="Reported Products">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reported Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage products that have been reported for issues</p>
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
                    placeholder="Search reported products..."
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

        {/* Reported Products List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-red-600">
                        <Flag className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{product.reportCount} reports</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Product Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Store className="w-4 h-4 mr-1" />
                          {product.store.name}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="font-medium">रू {product.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200">Report Reason</h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            {product.reportReason}
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                            Reported on {new Date(product.reportedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-yellow-600 hover:text-yellow-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          Deactivate
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No reported products found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'No products have been reported for review'
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