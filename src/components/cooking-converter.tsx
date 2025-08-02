
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

// --- Conversion Data ---
// Base unit for volume: milliliters (ml)
// Base unit for weight: grams (g)

const volumeUnits = {
    teaspoons: { name: 'Teaspoons (US)', toBase: 4.92892 },
    tablespoons: { name: 'Tablespoons (US)', toBase: 14.7868 },
    fluid_ounces: { name: 'Fluid Ounces (US)', toBase: 29.5735 },
    cups: { name: 'Cups (US)', toBase: 236.588 },
    pints: { name: 'Pints (US)', toBase: 473.176 },
    quarts: { name: 'Quarts (US)', toBase: 946.353 },
    gallons: { name: 'Gallons (US)', toBase: 3785.41 },
    milliliters: { name: 'Milliliters', toBase: 1 },
    liters: { name: 'Liters', toBase: 1000 },
};

const weightUnits = {
    ounces: { name: 'Ounces', toBase: 28.3495 },
    pounds: { name: 'Pounds', toBase: 453.592 },
    grams: { name: 'Grams', toBase: 1 },
    kilograms: { name: 'Kilograms', toBase: 1000 },
};

type UnitData = typeof volumeUnits | typeof weightUnits;

interface ConverterTabProps {
    units: UnitData;
    defaultFrom: string;
    defaultTo: string;
}

const ConverterTab = ({ units, defaultFrom, defaultTo }: ConverterTabProps) => {
    const [inputValue, setInputValue] = useState('1');
    const [fromUnit, setFromUnit] = useState(defaultFrom);
    const [toUnit, setTounit] = useState(defaultTo);

    const convertedValue = useMemo(() => {
        const value = parseFloat(inputValue);
        if (isNaN(value)) return '...';

        const from = units[fromUnit as keyof typeof units];
        const to = units[toUnit as keyof typeof units];

        if (!from || !to) return '...';

        const valueInBase = value * from.toBase;
        const result = valueInBase / to.toBase;

        return result.toLocaleString('en-US', { maximumFractionDigits: 3 });
    }, [inputValue, fromUnit, toUnit, units]);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label htmlFor={`input-val-${defaultFrom}`}>Value</Label>
                    <Input id={`input-val-${defaultFrom}`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} type="number" />
                </div>
                <div className="flex-1 space-y-2">
                    <Label>From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(units).map(([key, { name }]) => (
                                <SelectItem key={key} value={key}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <ArrowRightLeft className="hidden sm:block h-6 w-6 shrink-0" />
                <div className="flex-1 space-y-2">
                    <Label>To</Label>
                     <Select value={toUnit} onValueChange={setTounit}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(units).map(([key, { name }]) => (
                                <SelectItem key={key} value={key}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="text-center pt-4">
                <Label>Result</Label>
                <p className="text-2xl font-bold">{convertedValue}</p>
            </div>
        </div>
    );
}

const CookingConverter = () => {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Cooking Measurement Converter</CardTitle>
                <CardDescription>
                    Easily convert between common cooking units for volume and weight.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="volume" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="volume">Volume</TabsTrigger>
                        <TabsTrigger value="weight">Weight</TabsTrigger>
                    </TabsList>
                    <TabsContent value="volume">
                       <ConverterTab units={volumeUnits} defaultFrom="cups" defaultTo="grams" />
                    </TabsContent>
                    <TabsContent value="weight">
                        <ConverterTab units={weightUnits} defaultFrom="pounds" defaultTo="kilograms" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CookingConverter;
