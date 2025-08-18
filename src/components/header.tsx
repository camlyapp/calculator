
"use client";

import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { SearchCommand } from './search-command';

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
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/camly.png" alt="Camly Logo" width={32} height={32} className="h-8 w-8" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Camly
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
             <SearchCommand />
             <ThemeToggle />
             <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Open menu">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-auto">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                     <nav className="flex flex-col space-y-4 mt-8">
                        {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
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
                            </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
