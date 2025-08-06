"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminRouteGuard } from '@/components/auth/admin-route-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Package,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockCategories: Category[] = [
        {
          _id: '1',
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          slug: 'electronics',
          isActive: true,
          productCount: 45,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          name: 'Clothing',
          description: 'Fashion and apparel',
          slug: 'clothing',
          isActive: true,
          productCount: 128,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z'
        },
        {
          _id: '3',
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          slug: 'home-garden',
          isActive: true,
          productCount: 67,
          createdAt: '2024-01-05T10:00:00Z',
          updatedAt: '2024-01-05T10:00:00Z'
        },
        {
          _id: '4',
          name: 'Sports & Outdoors',
          description: 'Sports equipment and outdoor gear',
          slug: 'sports-outdoors',
          isActive: false,
          productCount: 23,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setShowAddModal(true);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      // Mock API call
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat._id === categoryId 
          ? { ...cat, isActive: !cat.isActive }
          : cat
      ));
      toast.success('Category status updated');
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  return (
    <AdminRouteGuard>
      <AdminLayout title="Categories Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Categories Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage product categories
              </p>
            </div>
            <Button onClick={handleAddCategory} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card key={category._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Package className="w-4 h-4" />
                        <span>{category.productCount} products</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Updated {new Date(category.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryStatus(category._id)}
                        className={`flex-1 ${
                          category.isActive 
                            ? 'text-red-600 hover:text-red-700' 
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCategories.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add/Edit Modal would go here */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This modal would contain the form for adding/editing categories.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    toast.success(editingCategory ? 'Category updated!' : 'Category added!');
                    setShowAddModal(false);
                  }}
                  className="flex-1"
                >
                  {editingCategory ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRouteGuard>
  );
} 