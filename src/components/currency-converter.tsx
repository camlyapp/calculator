"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { convertCurrencyAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import DownloadResults from './download-results';

const currencies = [
    { code: "USD", name: "United States Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "GBP", name: "British Pound Sterling" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
];

const initialState = {
  message: undefined,
  conversion: undefined,
  errors: undefined,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
            Convert
        </Button>
    );
}

const CurrencyConverter = () => {
    const [state, formAction] = useActionState(convertCurrencyAction, initialState);
    const { toast } = useToast();
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state?.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: state.error,
            })
        }
    }, [state, toast]);

    return (
        <Card className="w-full mt-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Currency Converter</CardTitle>
                <CardDescription>
                    Convert currencies with simulated exchange rates.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className='space-y-2'>
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" name="amount" type="number" defaultValue="100" required />
                            {state?.errors?.amount && <p className="text-destructive text-sm mt-1">{state.errors.amount[0]}</p>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="fromCurrency">From</Label>
                            <Select name="fromCurrency" defaultValue="USD">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             {state?.errors?.fromCurrency && <p className="text-destructive text-sm mt-1">{state.errors.fromCurrency[0]}</p>}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="toCurrency">To</Label>
                             <Select name="toCurrency" defaultValue="EUR">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {state?.errors?.toCurrency && <p className="text-destructive text-sm mt-1">{state.errors.toCurrency[0]}</p>}
                        </div>
                    </div>
                     <SubmitButton />
                </CardContent>
            </form>

            {state?.conversion && (
                 <CardContent ref={resultsRef}>
                    <div className="text-center p-6 bg-secondary/50 rounded-lg">
                        <p className="text-muted-foreground">Converted Amount</p>
                        <p className="text-4xl font-bold text-primary">
                            {state.conversion.convertedAmount.toLocaleString('en-US', { style: 'currency', currency: (document.getElementsByName('toCurrency')[0] as HTMLSelectElement).value, minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                           Exchange Rate: 1 {(document.getElementsByName('fromCurrency')[0] as HTMLSelectElement).value} = {state.conversion.exchangeRate.toFixed(4)} {(document.getElementsByName('toCurrency')[0] as HTMLSelectElement).value}
                        </p>
                    </div>
                </CardContent>
            )}
             {state?.conversion && (
                <CardFooter>
                    <DownloadResults
                        fileName="currency_conversion"
                        resultsRef={resultsRef}
                    />
                </CardFooter>
             )}

        </Card>
    );
};

export default CurrencyConverter;
