
"use client";

import { useCurrency, type Currency } from '@/context/currency-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign, IndianRupee } from 'lucide-react';

const GlobalCurrencySwitcher = () => {
    const { currency, setCurrency } = useCurrency();

    const CurrencyIcon = currency === 'INR' ? IndianRupee : DollarSign;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Switch currency">
                    <CurrencyIcon className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setCurrency('USD')}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>USD</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrency('INR')}>
                    <IndianRupee className="mr-2 h-4 w-4" />
                    <span>INR</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default GlobalCurrencySwitcher;
