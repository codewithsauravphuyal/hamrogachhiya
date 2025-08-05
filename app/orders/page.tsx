"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: '1',
    items: [
      {
        id: 'item-1',
        productId: '1',
        product: {
          id: '1',
          name: 'Organic Fresh Apples',
          description: 'Sweet and juicy organic apples',
          price: 4.99,
          images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          category: 'Groceries',
          tags: ['organic', 'fresh'],
          variants: [],
          stock: 50,
          storeId: 'store1',
          storeName: 'Fresh Market',
          rating: 4.5,
          reviewCount: 128,
          isActive: true,
          createdAt: '2024-01-01'
        },
        quantity: 2,
        price: 4.99
      }
    ],
    total: 9.98,
    subtotal: 9.98,
    tax: 0.80,
    deliveryFee: 0,
    status: 'delivered' as OrderStatus,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'addr-1',
      type: 'home',
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      isDefault: true
    },
    estimatedDelivery: '2024-01-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: 'order-2',
    userId: '1',
    items: [
      {
        id: 'item-2',
        productId: '2',
        product: {
          id: '2',
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones',
          price: 89.99,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          category: 'Electronics',
          tags: ['wireless', 'bluetooth'],
          variants: [],
          stock: 25,
          storeId: 'store2',
          storeName: 'Tech Store',
          rating: 4.8,
          reviewCount: 256,
          isActive: true,
          createdAt: '2024-01-01'
        },
        quantity: 1,
        price: 89.99
      }
    ],
    total: 97.19,
    subtotal: 89.99,
    tax: 7.20,
    deliveryFee: 0,
    status: 'shipped' as OrderStatus,
    paymentMethod: 'khalti',
    paymentStatus: 'paid',
    deliveryAddress: {
      id: 'addr-1',
      type: 'home',
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      isDefault: true
    },
    estimatedDelivery: '2024-01-20',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19'
  },
  {
    id: 'order-3',
    userId: '1',
    items: [
      {
        id: 'item-3',
        productId: '3',
        product: {
          id: '3',
          name: 'Premium Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt',
          price: 24.99,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          category: 'Fashion',
          tags: ['cotton', 'comfortable'],
          variants: [],
          stock: 100,
          storeId: 'store3',
          storeName: 'Fashion Hub',
          rating: 4.3,
          reviewCount: 89,
          isActive: true,
          createdAt: '2024-01-01'
        },
        quantity: 3,
        price: 24.99
      }
    ],
    total: 80.97,
    subtotal: 74.97,
    tax: 6.00,
    deliveryFee: 0,
    status: 'pending' as OrderStatus,
    paymentMethod: 'esewa',
    paymentStatus: 'pending',
    deliveryAddress: {
      id: 'addr-1',
      type: 'home',
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      isDefault: true
    },
    estimatedDelivery: '2024-01-25',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  }
];

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5" />;
    case 'confirmed':
    case 'packed':
      return <Package className="w-5 h-5" />;
    case 'shipped':
      return <Truck className="w-5 h-5" />;
    case 'delivered':
      return <CheckCircle className="w-5 h-5" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [orders] = useState<Order[]>(mockOrders);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please log in to view your orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to be logged in to access your order history.
            </p>
            <Link href="/login">
              <Button variant="brand">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your orders and view order history
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start shopping to see your orders here
              </p>
              <Link href="/">
                <Button variant="brand">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.product.storeName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Payment: <span className="capitalize">{order.paymentMethod}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Estimated Delivery: {formatDate(order.estimatedDelivery)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            Total: {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 