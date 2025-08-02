import { Landmark, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <Landmark className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              LoanSage
            </span>
          </div>

          <div className="text-center">
             <div className="flex flex-col space-y-2">
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                </Link>
                <Link href="/math-science-calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Math & Science Calculators
                </Link>
             </div>
             <p className="text-sm text-muted-foreground mt-4">&copy; {new Date().getFullYear()} LoanSage. All Rights Reserved.</p>
             <p className="text-xs text-muted-foreground/80 mt-1">Disclaimer: This tool is for informational purposes only. Consult with a financial professional before making any decisions.</p>
          </div>

          <div className="flex space-x-4 justify-center md:justify-end">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
