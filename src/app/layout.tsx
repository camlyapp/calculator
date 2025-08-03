
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import SeoContent from '@/components/seo-content';

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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SeoContent />
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
