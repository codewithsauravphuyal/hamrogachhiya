import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get auth token from store
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from auth store first
  try {
    const { useAuthStore } = require('@/stores/auth-store');
    const { token } = useAuthStore.getState();
    if (token) return token;
  } catch (error) {
    // Fallback to localStorage
    return localStorage.getItem('token');
  }
  
  return null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'confirmed':
      return 'text-blue-600 bg-blue-100';
    case 'packed':
      return 'text-purple-600 bg-purple-100';
    case 'shipped':
      return 'text-indigo-600 bg-indigo-100';
    case 'delivered':
      return 'text-green-600 bg-green-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
} 