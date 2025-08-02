
"use client";

import { Landmark, Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
    { href: '/', label: 'Financial Calculators' },
    { href: '/math-science-calculators', label: 'Math & Science' },
    { href: '/date-time-calculators', label: 'Date & Time' },
    { href: '/other-specialized-calculators', label: 'Other Calculators' },
];

const Header = () => {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              LoanSage
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
             {navLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                   <Button variant="ghost" className={cn(
                        "text-muted-foreground transition-colors hover:text-primary",
                        pathname === link.href && "text-primary"
                   )}>
                        {link.label}
                   </Button>
                </Link>
             ))}
             <ThemeToggle />
          </nav>
          
           <div className="flex md:hidden items-center gap-2">
             <ThemeToggle />
             <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                     <nav className="flex flex-col space-y-4 mt-8">
                        {navLinks.map((link) => (
                             <Link key={link.href} href={link.href} passHref>
                                <SheetClose asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start text-lg",
                                            pathname === link.href && "text-primary bg-accent"
                                        )}
                                    >
                                        {link.label}
                                    </Button>
                                </SheetClose>
                             </Link>
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
