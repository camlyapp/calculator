
"use client";

import { BrainCircuit, CalendarDays, HeartPulse, Landmark, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { SearchCommand } from './search-command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent } from './ui/menubar';
import GlobalCurrencySwitcher from './global-currency-switcher';


const navLinks = [
    { href: '/', label: 'Financial', icon: Landmark },
    { href: '/personal-health-calculators', label: 'Personal & Health', icon: HeartPulse },
    { href: '/math-science-calculators', label: 'Math & Science', icon: BrainCircuit },
    { href: '/date-time-calculators', label: 'Date & Time', icon: CalendarDays },
    { href: '/other-specialized-calculators', label: 'Other', icon: Sparkles },
];

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
             <div className="relative flex items-center justify-center">
                <h1 className="relative text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-rainbow-glow">
                    Camly
                </h1>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
             <SearchCommand />
             <GlobalCurrencySwitcher />
             <Menubar className="p-0 border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger asChild>
                   <Button variant="ghost" size="icon" aria-label="Open menu" className="relative">
                      <div className={cn("flex items-center justify-center rounded-full p-2 transition-all", isMenuOpen && "animated-border-box")}>
                          <Menu className="h-6 w-6" />
                      </div>
                      <span className="sr-only">Open menu</span>
                    </Button>
                </MenubarTrigger>
                <MenubarContent align="end" onFocusOutside={() => setMenuOpen(false)} onInteractOutside={() => setMenuOpen(false)}>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 text-card-foreground shadow-sm hover:from-primary/20 hover:to-accent/20 transition-all h-full flex flex-col items-center justify-center text-center">
                                        <div className="p-3 rounded-full bg-background/70 mb-2">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-semibold">{link.label}</h3>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
