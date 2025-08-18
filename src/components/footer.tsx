
"use client";

import { Twitter, Github, Linkedin, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePwaInstall } from '@/hooks/use-pwa-install';

const Footer = () => {
  const { installPrompt, handleInstallClick } = usePwaInstall();

  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center space-x-3">
             <div className="p-1 rounded-md animated-border-box">
              <Image src="/camly.png" alt="Camly Logo" width={32} height={32} className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Camly
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
             <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Financial
            </Link>
             <Link href="/about-us" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
            </Link>
             <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
            </Link>
             <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
            </Link>
             {installPrompt && (
              <a href="#" onClick={handleInstallClick} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Download className="h-4 w-4" /> Install App
              </a>
            )}
          </nav>

          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6" />
            </a>
          </div>
          
          <div className="text-center">
             <p className="text-sm text-muted-foreground mt-4">&copy; {new Date().getFullYear()} Camly. All Rights Reserved.</p>
             <p className="text-xs text-muted-foreground/80 mt-1">Disclaimer: This tool is for informational purposes only. Consult with a financial professional before making any decisions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
