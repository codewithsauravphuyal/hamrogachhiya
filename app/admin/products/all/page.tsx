"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProductsAllRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to all products management page...
        </p>
      </div>
    </div>
  );
} 