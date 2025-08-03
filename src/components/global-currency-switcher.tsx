
"use client";

import { useCurrency, type Currency } from '@/context/currency-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const GlobalCurrencySwitcher = () => {
    const { currency, setCurrency } = useCurrency();

    return (
        <div className="flex justify-end">
            <div className='w-[180px] space-y-2'>
              <Label htmlFor="global-currency-select">Global Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                  <SelectTrigger id="global-currency-select">
                      <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
              </Select>
            </div>
        </div>
    );
}

export default GlobalCurrencySwitcher;
