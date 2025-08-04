
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import SeoContent from '@/components/seo-content';
import { CurrencyProvider } from '@/context/currency-context';
import PwaInstaller from '@/components/pwa-installer';

export const metadata: Metadata = {
  title: 'Camly - Free Smart Financial & Loan Calculator',
  description: 'A comprehensive suite of free financial calculators including loan, mortgage, savings, retirement, and more. Get AI-powered suggestions to optimize your finances.',
  keywords: ['loan calculator', 'mortgage calculator', 'interest calculator', 'retirement planner', 'investment calculator', 'financial planning', 'emi calculator', 'ai finance'],
  authors: [{ name: 'Camly Team' }],
  openGraph: {
    title: 'Camly - Free Smart Financial & Loan Calculator',
    description: 'A comprehensive suite of free financial calculators including loan, mortgage, savings, retirement, and more. Get AI-powered suggestions to optimize your finances.',
    url: 'https://loansage.ai',
    siteName: 'Camly',
    images: [
      {
        url: '/camly.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camly - Free Smart Financial & Loan Calculator',
    description: 'A comprehensive suite of free financial calculators including loan, mortgage, savings, retirement, and more. Get AI-powered suggestions to optimize your finances.',
    images: ['/camly.png'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="application-name" content="Camly" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Camly" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <PwaInstaller />
            {children}
            <SeoContent />
            <Footer />
            <Toaster />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
