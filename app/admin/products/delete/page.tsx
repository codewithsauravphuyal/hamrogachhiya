"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Package, 
  Search, 
  Filter, 
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  isActive: boolean;
  store: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function AdminDeleteProducts() {
  const { user, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchProducts();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProduct(productId);
      const response = await fetch(`/api/admin/products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      fetchProducts();
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = selectedProducts.map(productId =>
        fetch(`/api/admin/products`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        })
      );

      await Promise.all(deletePromises);
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete some products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Delete Products">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Delete Products">
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
    <DashboardLayout title="Delete Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Delete Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Remove products from the platform</p>
            </div>
          </div>
          {selectedProducts.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
        </div>

        {/* Warning */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Warning:</span>
              <span>Deleting products is permanent and cannot be undone.</span>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products or stores..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            {filteredProducts.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select All ({filteredProducts.length} products)
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredProducts.map((product) => (
              <Card key={product._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-300"
                      />
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
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Store: {product.store.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {product.category} • Stock: {product.stock}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingProduct === product._id}
                      >
                        {deletingProduct === product._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'No products have been added yet'
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