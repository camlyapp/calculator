
"use client";

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { SearchCommand } from './search-command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';

const navLinks = [
    { href: '/personal-health-calculators', label: 'Personal & Health' },
    { href: '/math-science-calculators', label: 'Math & Science' },
    { href: '/date-time-calculators', label: 'Date & Time' },
    { href: '/', label: 'Financial' },
    { href: '/other-specialized-calculators', label: 'Other' },
];

const Header = () => {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
             <div className="relative flex items-center justify-center">
                <h1 className="relative text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-rainbow-glow">
                    <Image src="/camly.png" alt="Camly background" width={40} height={40} className="absolute top-1/2 left-0 transform -translate-y-1/2 opacity-30 pointer-events-none" />
                    Camly
                </h1>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
             <SearchCommand />
             <Dialog open={isSheetOpen} onOpenChange={setSheetOpen}>
                <DialogTrigger asChild>
                   <Button variant="ghost" size="icon" aria-label="Open menu" className="relative">
                      <div className={cn("flex items-center justify-center rounded-full p-2 transition-all", isSheetOpen && "animated-border-box")}>
                          <Menu className="h-6 w-6" />
                      </div>
                      <span className="sr-only">Open menu</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                    </DialogHeader>
                     <nav className="flex flex-col space-y-4 mt-8">
                        {navLinks.map((link) => (
                            <DialogClose asChild key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "w-full justify-start text-lg p-2 rounded-md",
                                        "hover:bg-accent hover:text-accent-foreground transition-colors",
                                        pathname === link.href ? "text-primary bg-accent font-semibold" : "text-muted-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </DialogClose>
                        ))}
                    </nav>
                </DialogContent>
            </Dialog>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
