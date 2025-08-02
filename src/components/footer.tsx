import { Landmark, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Landmark className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              LoanSage
            </span>
          </div>
          <div className="text-center md:text-left mb-6 md:mb-0">
             <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} LoanSage. All Rights Reserved.</p>
             <p className="text-xs text-muted-foreground/80 mt-1">Disclaimer: This tool is for informational purposes only. Consult with a financial professional before making any decisions.</p>
          </div>
          <div className="flex space-x-4">
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
