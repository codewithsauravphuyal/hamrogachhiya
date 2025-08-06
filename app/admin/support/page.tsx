"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminLayout } from '@/components/layout/admin-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  Mail, 
  Search,
  Filter,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Reply,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface SupportTicket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'order' | 'general' | 'refund';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  responseCount: number;
}

export default function AdminSupport() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchTickets();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      const response = await fetch('/api/admin/support/tickets', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load support tickets');
      }
      
      const data = await response.json();
      setTickets(data.data || []);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      const { token } = useAuthStore.getState();
      
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }
      
      toast.success('Ticket status updated successfully');
      fetchTickets();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update ticket status');
    }
  };

  const handleAssignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      const { token } = useAuthStore.getState();
      
      const response = await fetch(`/api/admin/support/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ assigneeId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }
      
      toast.success('Ticket assigned successfully');
      fetchTickets();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to assign ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💳';
      case 'order': return '📦';
      case 'refund': return '💰';
      case 'general': return '❓';
      default: return '📝';
    }
  };

  if (!hasHydrated) {
    return (
      <AdminLayout title="Support Tickets">
        <DashboardContentSkeleton />
      </AdminLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Support Tickets">
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
    <AdminLayout title="Support Tickets">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer support requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets, customers, or ticket numbers..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="grid gap-6">
            {filteredTickets.map((ticket) => (
              <Card key={ticket._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          #{ticket.ticketNumber} • {ticket.customer.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.description}
                  </p>
                  
                  {/* Ticket Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <div className="flex items-center space-x-1 mt-1">
                        <span>{getCategoryIcon(ticket.category)}</span>
                        <span className="capitalize">{ticket.category}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Customer:</span>
                      <p className="mt-1">{ticket.customer.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Assignment */}
                  {ticket.assignedTo && (
                    <div className="text-sm">
                      <span className="font-medium">Assigned to:</span>
                      <p className="mt-1">{ticket.assignedTo.name}</p>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{ticket.responseCount} responses</span>
                    </div>
                    {ticket.lastResponseAt && (
                      <div className="flex items-center space-x-1">
                        <Reply className="w-4 h-4" />
                        <span>Last: {new Date(ticket.lastResponseAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAssignTicket(ticket._id, user._id)}
                      >
                        <User className="w-3 h-3 mr-1" />
                        Assign to Me
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      {ticket.status === 'open' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(ticket._id, 'in_progress')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Start Work
                        </Button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(ticket._id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                      {ticket.status === 'resolved' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(ticket._id, 'closed')}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTickets.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No support tickets found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No support tickets at this time'
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