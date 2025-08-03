
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

// --- Conversion Data ---

const lengthUnits = {
    meters: { name: 'Meters', toBase: 1 },
    kilometers: { name: 'Kilometers', toBase: 1000 },
    centimeters: { name: 'Centimeters', toBase: 0.01 },
    millimeters: { name: 'Millimeters', toBase: 0.001 },
    miles: { name: 'Miles', toBase: 1609.34 },
    yards: { name: 'Yards', toBase: 0.9144 },
    feet: { name: 'Feet', toBase: 0.3048 },
    inches: { name: 'Inches', toBase: 0.0254 },
};

const weightUnits = {
    grams: { name: 'Grams', toBase: 1 },
    kilograms: { name: 'Kilograms', toBase: 1000 },
    milligrams: { name: 'Milligrams', toBase: 0.001 },
    tonnes: { name: 'Metric Tons', toBase: 1000000 },
    pounds: { name: 'Pounds', toBase: 453.592 },
    ounces: { name: 'Ounces', toBase: 28.3495 },
};

const volumeUnits = {
    liters: { name: 'Liters', toBase: 1 },
    milliliters: { name: 'Milliliters', toBase: 0.001 },
    gallons: { name: 'US Gallons', toBase: 3.78541 },
    quarts: { name: 'US Quarts', toBase: 0.946353 },
    pints: { name: 'US Pints', toBase: 0.473176 },
    fluid_ounces: { name: 'US Fluid Ounces', toBase: 0.0295735 },
};

const temperatureUnits = ['celsius', 'fahrenheit', 'kelvin'];


// --- Generic Converter Component ---

type UnitData = typeof lengthUnits | typeof weightUnits | typeof volumeUnits;

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

        return result.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }, [inputValue, fromUnit, toUnit, units]);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="input-val">Value</Label>
                    <Input id="input-val" value={inputValue} onChange={(e) => setInputValue(e.target.value)} type="number" />
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

const TemperatureConverter = () => {
    const [value, setValue] = useState('0');
    const [fromUnit, setFromUnit] = useState('celsius');
    const [toUnit, setToUnit] = useState('fahrenheit');

    const convertedValue = useMemo(() => {
        const val = parseFloat(value);
        if (isNaN(val)) return '...';

        if (fromUnit === toUnit) return val.toLocaleString();

        let result;
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') result = (val * 9/5) + 32;
            else result = val + 273.15; // to Kelvin
        } else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') result = (val - 32) * 5/9;
            else result = (val - 32) * 5/9 + 273.15; // to Kelvin
        } else { // from Kelvin
            if (toUnit === 'celsius') result = val - 273.15;
            else result = (val - 273.15) * 9/5 + 32; // to Fahrenheit
        }
        
        return result.toFixed(2);
    }, [value, fromUnit, toUnit]);

     return (
        <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="temp-val">Value</Label>
                    <Input id="temp-val" value={value} onChange={(e) => setValue(e.target.value)} type="number" />
                </div>
                <div className="flex-1 space-y-2">
                    <Label>From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {temperatureUnits.map(unit => (
                                <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <ArrowRightLeft className="hidden sm:block h-6 w-6 shrink-0" />
                <div className="flex-1 space-y-2">
                    <Label>To</Label>
                     <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {temperatureUnits.map(unit => (
                                <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>
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
};


const UnitConverter = () => {
    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Unit Converter</CardTitle>
                <CardDescription>Convert between common units of measurement.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="length" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 h-auto">
                        <TabsTrigger value="length">Length</TabsTrigger>
                        <TabsTrigger value="weight">Weight</TabsTrigger>
                        <TabsTrigger value="volume">Volume</TabsTrigger>
                        <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    </TabsList>
                    <TabsContent value="length">
                       <ConverterTab units={lengthUnits} defaultFrom="meters" defaultTo="feet" />
                    </TabsContent>
                    <TabsContent value="weight">
                        <ConverterTab units={weightUnits} defaultFrom="kilograms" defaultTo="pounds" />
                    </TabsContent>
                    <TabsContent value="volume">
                        <ConverterTab units={volumeUnits} defaultFrom="liters" defaultTo="gallons" />
                    </TabsContent>
                    <TabsContent value="temperature">
                        <TemperatureConverter />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default UnitConverter;
