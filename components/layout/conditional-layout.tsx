"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/seller') || pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
} 