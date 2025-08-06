"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardContentSkeleton } from '@/components/ui/skeleton-loaders';
import { 
  CreditCard, 
  Search,
  Filter,
  Eye,
  Download,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  transactionId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  user: {
    _id: string;
    name: string;
    email: string;
  };
  store?: {
    _id: string;
    name: string;
  };
  platformFee: number;
  sellerAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTransactions() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    platformEarnings: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }
    
    fetchTransactions();
  }, [isAuthenticated, user, hasHydrated]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { token } = useAuthStore.getState();
      
      // Mock transactions for demonstration
      const mockTransactions: Transaction[] = [
        {
          _id: '1',
          transactionId: 'TXN-2024-001',
          orderNumber: 'ORD-2024-001',
          amount: 15.09,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          user: {
            _id: 'user1',
            name: 'Saurav Phuyal',
            email: 'saurav@admin.com'
          },
          store: {
            _id: 'store1',
            name: 'Fresh Market'
          },
          platformFee: 1.51,
          sellerAmount: 13.58,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setTransactions(mockTransactions);
      
      // Calculate stats
      const totalAmount = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
      const platformEarnings = mockTransactions.reduce((sum, t) => sum + t.platformFee, 0);
      const pendingAmount = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setStats({
        totalTransactions: mockTransactions.length,
        totalAmount,
        platformEarnings,
        pendingAmount
      });
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!hasHydrated) {
    return (
      <DashboardLayout title="Transactions">
        <DashboardContentSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout title="Transactions">
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
    <DashboardLayout title="Transactions">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                All time transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total transaction value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.platformEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Commission earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>
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
                    placeholder="Search transactions..."
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {loading ? (
          <DashboardContentSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transactions ({filteredTransactions.length})</span>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium">Order</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Store</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Platform Fee</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">{transaction.transactionId}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{transaction.orderNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{transaction.user.name}</p>
                            <p className="text-sm text-gray-500">{transaction.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {transaction.store ? (
                            <span className="text-sm">{transaction.store.name}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-green-600">${transaction.platformFee.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions found</p>
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