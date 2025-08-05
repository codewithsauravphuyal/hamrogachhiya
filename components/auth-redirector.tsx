"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function AuthRedirector() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('AuthRedirector effect:', {
      pathname,
      isAuthenticated,
      userRole: user?.role,
      hasHydrated
    });

    if (!hasHydrated) return;

    // If user is authenticated, redirect from login/register pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      console.log('Redirecting authenticated user from login/register page');
      if (user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/');
      }
      return;
    }

    // If user is not authenticated, redirect from protected pages
    if (!isAuthenticated) {
      const protectedRoutes = ['/seller', '/admin', '/orders', '/wishlist', '/cart'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute) {
        console.log('Redirecting unauthenticated user from protected route');
        toast.error('Please login to access this page');
        router.push('/login');
        return;
      }
    }

    // Role-based access control
    if (isAuthenticated && user) {
      // Seller routes - only accessible by sellers
      if (pathname.startsWith('/seller') && user.role !== 'seller') {
        console.log('Redirecting non-seller from seller route');
        toast.error('You do not have permission to access the seller dashboard');
        router.push('/');
        return;
      }

      // Admin routes - only accessible by admins
      if (pathname.startsWith('/admin') && user.role !== 'admin') {
        console.log('Redirecting non-admin from admin route');
        toast.error('You do not have permission to access the admin dashboard');
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, user, hasHydrated, pathname, router]);

  return null;
}