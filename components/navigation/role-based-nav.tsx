"use client";

import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  User, 
  Store, 
  Settings, 
  LogOut,
  Heart,
  MessageSquare,
  Bell,
  BarChart3,
  Plus,
  List,
  Truck,
  CreditCard,
  Gift,
  HelpCircle,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Mail,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function RoleBasedNavigation() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  // Customer Navigation
  const customerNav: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/products', icon: Package },
    { label: 'My Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Contact', href: '/contact', icon: MessageSquare },
  ];

  // Seller Navigation
  const sellerNav: NavItem[] = [
    { label: 'Dashboard', href: '/seller', icon: BarChart3 },
    { label: 'Products', href: '/seller/products', icon: Package },
    { label: 'Add Product', href: '/seller/products/add', icon: Plus },
    { label: 'Product List', href: '/seller/products/list', icon: List },
    { label: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { label: 'All Orders', href: '/seller/orders/all', icon: Truck },
    { label: 'Delivery Status', href: '/seller/delivery', icon: Truck },
    { label: 'Payments', href: '/seller/payments', icon: CreditCard },
    { label: 'Received Payments', href: '/seller/payments/received', icon: CreditCard },
    { label: 'Payouts', href: '/seller/payments/payouts', icon: CreditCard },
    { label: 'Discounts', href: '/seller/discounts', icon: Gift },
    { label: 'Support', href: '/seller/support', icon: HelpCircle },
    { label: 'Store Settings', href: '/seller/settings', icon: Settings },
  ];

  // Admin Navigation - Comprehensive management
  const adminNav: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Add Product', href: '/admin/products/add', icon: Plus },
    { label: 'All Products', href: '/admin/products/all', icon: List },
    { label: 'Edit Products', href: '/admin/products/edit', icon: Edit },
    { label: 'Delete Products', href: '/admin/products/delete', icon: Trash2 },
    { label: 'Reported Products', href: '/admin/products/reported', icon: AlertTriangle },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'All Orders', href: '/admin/orders/all', icon: List },
    { label: 'Manage Orders', href: '/admin/orders/manage', icon: Edit },
    { label: 'Order Issues', href: '/admin/orders/issues', icon: AlertTriangle },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'All Users', href: '/admin/users/all', icon: List },
    { label: 'Customers', href: '/admin/users/customers', icon: User },
    { label: 'Sellers', href: '/admin/users/sellers', icon: Store },
    { label: 'Manage Users', href: '/admin/users/manage', icon: Edit },
    { label: 'Stores', href: '/admin/stores', icon: Store },
    { label: 'All Stores', href: '/admin/stores/all', icon: List },
    { label: 'Manage Stores', href: '/admin/stores/manage', icon: Edit },
    { label: 'Approve Sellers', href: '/admin/sellers/approve', icon: Shield },
    { label: 'Flagged Stores', href: '/admin/stores/flagged', icon: AlertTriangle },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Transactions', href: '/admin/payments/transactions', icon: DollarSign },
    { label: 'Platform Earnings', href: '/admin/payments/earnings', icon: TrendingUp },
    { label: 'Banners', href: '/admin/banners', icon: FileText },
    { label: 'Blogs', href: '/admin/blogs', icon: FileText },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Support Tickets', href: '/admin/support', icon: Mail },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  // Public Navigation
  const publicNav: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/products', icon: Package },
    { label: 'Contact', href: '/contact', icon: MessageSquare },
  ];

  const getNavigationItems = (): NavItem[] => {
    if (!isAuthenticated) {
      return publicNav;
    }

    switch (user?.role) {
      case 'admin':
        return adminNav;
      case 'seller':
        return sellerNav;
      case 'customer':
      default:
        return customerNav;
    }
  };

  const navItems = getNavigationItems();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveLink(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-r-2 border-orange-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
      
      {isAuthenticated && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}