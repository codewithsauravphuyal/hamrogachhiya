"use client";

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Users,
  Store,
  CreditCard,
  FileText,
  Settings,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  LogOut,
  Package,
  List,
  Edit,
  AlertTriangle,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: NavItem[];
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

export function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['dashboard', 'users', 'stores', 'payments', 'content', 'support', 'settings']));

  // Check if user is admin
  if (user?.role !== 'admin') {
    return null;
  }

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      items: [
        { label: 'Overview', href: '/admin', icon: BarChart3, description: 'Main dashboard overview' }
      ]
    },
    {
      title: 'Users',
      icon: Users,
      items: [
        { label: 'All Users', href: '/admin/users/all', icon: List, description: 'View all platform users' },
        { label: 'Customers', href: '/admin/users/customers', icon: Users, description: 'Manage customer accounts' },
        { label: 'Sellers', href: '/admin/users/sellers', icon: Store, description: 'Manage seller accounts' },
        { label: 'Manage Users', href: '/admin/users/manage', icon: Edit, description: 'Edit user permissions and details' }
      ]
    },
    {
      title: 'Stores',
      icon: Store,
      items: [
        { label: 'All Stores', href: '/admin/stores', icon: List, description: 'View all registered stores' },
        { label: 'Approve Sellers', href: '/admin/sellers/approve', icon: Shield, description: 'Approve new seller applications' },
        { label: 'Flagged Stores', href: '/admin/stores/flagged', icon: AlertTriangle, description: 'Review flagged store accounts' }
      ]
    },
    {
      title: 'Payments',
      icon: CreditCard,
      items: [
        { label: 'Transactions', href: '/admin/payments/transactions', icon: DollarSign, description: 'View all payment transactions' },
        { label: 'Platform Earnings', href: '/admin/payments/earnings', icon: TrendingUp, description: 'Track platform revenue and earnings' }
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      items: [
        { label: 'Banners', href: '/admin/banners', icon: FileText, description: 'Manage promotional banners' },
        { label: 'Blogs', href: '/admin/blogs', icon: FileText, description: 'Manage blog posts and content' },
        { label: 'Reviews', href: '/admin/reviews', icon: Star, description: 'Manage product and store reviews' },
        { label: 'Categories', href: '/admin/categories', icon: Tag, description: 'Create and manage product categories' }
      ]
    },
    {
      title: 'Support',
      icon: MessageSquare,
      items: [
        { label: 'Support Tickets', href: '/admin/support', icon: MessageSquare, description: 'Handle customer support tickets' }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      items: [
        { label: 'Platform Settings', href: '/admin/settings', icon: Settings, description: 'Configure platform settings' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups.has(group.title.toLowerCase());
          
          return (
            <div key={group.title} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.title.toLowerCase())}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <GroupIcon className="w-4 h-4" />
                  <span>{group.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Group Items */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = isActiveLink(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-r-2 border-orange-500'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400'
                        }`}
                        title={item.description}
                      >
                        <ItemIcon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
} 