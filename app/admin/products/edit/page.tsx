"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Package, 
  Search, 
  Filter, 
  Edit,
  Eye,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface EditFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Food & Beverages',
  'Other'
];

export default function AdminEditProducts() {
  const { user, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    isActive: true
  });

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

  const handleEditClick = (product: Product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      isActive: product.isActive
    });
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      isActive: true
    });
  };

  const handleEditSave = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          updates: editFormData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast.success('Product updated successfully');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  const handleStatusToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          updates: { isActive: !currentStatus }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product status');
      }

      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product status');
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
      <DashboardLayout title="Edit Products">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Edit Products">
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
    <DashboardLayout title="Edit Products">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Modify product information and settings</p>
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
            {filteredProducts.map((product) => (
              <Card key={product._id}>
                <CardContent className="pt-6">
                  {editingProduct === product._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Product Name
                          </label>
                          <Input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={editFormData.category}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                          >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stock
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={editFormData.stock}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <Textarea
                          value={editFormData.description}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`isActive-${product._id}`}
                          checked={editFormData.isActive}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`isActive-${product._id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Active Product
                        </label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleEditSave(product._id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Product Display
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
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
                        <div className="flex space-x-1">
                          <Link href={`/admin/products/${product._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(product._id, product.isActive)}
                          >
                            {product.isActive ? (
                              <XCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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