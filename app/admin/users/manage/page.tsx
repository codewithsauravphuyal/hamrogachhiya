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
  Eye,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Store,
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  lastLogin?: string;
}

const userRoles = [
  'customer',
  'seller',
  'admin'
];

export default function AdminManageUsers() {
  const { user: currentUser, isAuthenticated, hasHydrated, token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    isActive: true
  });

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchUsers();
  }, [isAuthenticated, currentUser, hasHydrated]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  };

  const handleEditCancel = () => {
    setEditingUser(null);
    setEditFormData({
      name: '',
      email: '',
      role: '',
      isActive: true
    });
  };

  const handleEditSave = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          updates: editFormData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          updates: { isActive: !currentStatus }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user status');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'seller': return <Store className="w-4 h-4" />;
      case 'customer': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'seller': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Manage Users">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <DashboardLayout title="Manage Users">
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
    <DashboardLayout title="Manage Users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
              <p className="text-gray-600 dark:text-gray-400">Update user information and permissions</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="all">All Roles</option>
                  {userRoles.map(role => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
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

        {/* Users List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user._id}>
                <CardContent className="pt-6">
                  {editingUser === user._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                          </label>
                          <Input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                          </label>
                          <select
                            value={editFormData.role}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                          >
                            {userRoles.map(role => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`isActive-${user._id}`}
                              checked={editFormData.isActive}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`isActive-${user._id}`} className="text-sm text-gray-700 dark:text-gray-300">
                              Active User
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleEditSave(user._id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // User Display
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {user.phone}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            {getRoleIcon(user.role)}
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(user._id, user.isActive)}
                          >
                            {user.isActive ? (
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
            
            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No users have been registered yet'
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