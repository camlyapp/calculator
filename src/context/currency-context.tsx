
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCurrency = localStorage.getItem('globalCurrency') as Currency;
    if (storedCurrency && ['USD', 'INR'].includes(storedCurrency)) {
      setCurrency(storedCurrency);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('globalCurrency', currency);
    }
  }, [currency, isMounted]);

  const updateCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (!isMounted) {
    // Render nothing or a loading state on the server to avoid hydration mismatch
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
