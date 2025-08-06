"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: 'top' | 'middle' | 'bottom';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBanners() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchBanners();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      const response = await fetch('/api/admin/banners', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load banners');
      }
      
      const data = await response.json();
      setBanners(data.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (bannerId: string, isActive: boolean) => {
    try {
      const { token } = useAuthStore.getState();
      
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ isActive })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update banner status');
      }
      
      toast.success(`Banner ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchBanners();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update banner status');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const { token } = useAuthStore.getState();
      
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }
      
      toast.success('Banner deleted successfully');
      fetchBanners();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete banner');
    }
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && banner.isActive) ||
                         (statusFilter === 'inactive' && !banner.isActive);
    return matchesSearch && matchesStatus;
  });

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'top': return 'bg-blue-100 text-blue-800';
      case 'middle': return 'bg-green-100 text-green-800';
      case 'bottom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasHydrated) {
    return (
      <AdminLayout title="Manage Banners">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Manage Banners">
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
    <AdminLayout title="Manage Banners">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Banners</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage promotional banners</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBanners.map((banner) => (
              <Card key={banner._id} className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {banner.image ? (
                      <img 
                        src={banner.image} 
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPositionColor(banner.position)}`}>
                      {banner.position}
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{banner.title}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(banner._id, !banner.isActive)}
                    >
                      {banner.isActive ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {banner.description}
                  </p>
                  
                  {banner.link && (
                    <div className="text-sm">
                      <span className="font-medium">Link:</span> 
                      <a href={banner.link} className="text-blue-600 hover:underline ml-1">
                        {banner.link}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBanner(banner._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredBanners.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No banners found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'No banners have been created yet'
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
    </AdminLayout>
  );
} 