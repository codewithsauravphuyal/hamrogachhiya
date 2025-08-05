import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import { AuthRedirector } from '@/components/auth-redirector'
import { AuthHydration } from '@/components/auth-hydration'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hamro Gachhiya - Quick Commerce Platform',
  description: 'Your one-stop destination for quick commerce. Order groceries, electronics, and more with lightning-fast delivery.',
  keywords: 'ecommerce, quick commerce, groceries, delivery, online shopping',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthHydration />
          <AuthRedirector />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '20px',
              },
            }}
            containerStyle={{
              top: '20px',
              bottom: 'auto',
            }}
            containerClassName="md:top-auto md:bottom-5"
          />
        </ThemeProvider>
      </body>
    </html>
  )
} 