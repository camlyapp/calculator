
import { Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/camly.png" alt="Camly Logo" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">
              Camly
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
             <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Financial
            </Link>
             <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
            </Link>
             <Link href="/math-science-calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Math & Science
            </Link>
             <Link href="/date-time-calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Date & Time
            </Link>
              <Link href="/personal-health-calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Personal & Health
            </Link>
             <Link href="/other-specialized-calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Other
            </Link>
          </nav>

          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
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
