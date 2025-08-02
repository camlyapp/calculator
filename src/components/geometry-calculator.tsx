
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const RectangleCalculator = () => {
    const [length, setLength] = useState('10');
    const [width, setWidth] = useState('5');
    const [result, setResult] = useState<{ area: string; perimeter: string } | null>(null);

    const calculate = () => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
            setResult(null);
            return;
        }
        setResult({
            area: (l * w).toLocaleString(),
            perimeter: (2 * (l + w)).toLocaleString(),
        });
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="rect-length">Length</Label>
                    <Input id="rect-length" value={length} onChange={(e) => setLength(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="rect-width">Width</Label>
                    <Input id="rect-width" value={width} onChange={(e) => setWidth(e.target.value)} type="number" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
            {result && (
                <div className="text-center pt-4 space-y-2">
                    <div>
                        <Label>Area</Label>
                        <p className="text-2xl font-bold">{result.area}</p>
                    </div>
                     <div>
                        <Label>Perimeter</Label>
                        <p className="text-2xl font-bold">{result.perimeter}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const CircleCalculator = () => {
    const [radius, setRadius] = useState('5');
    const [result, setResult] = useState<{ area: string; circumference: string } | null>(null);

    const calculate = () => {
        const r = parseFloat(radius);
        if (isNaN(r) || r <= 0) {
            setResult(null);
            return;
        }
        setResult({
            area: (Math.PI * r * r).toFixed(3),
            circumference: (2 * Math.PI * r).toFixed(3),
        });
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="circle-radius">Radius</Label>
                <Input id="circle-radius" value={radius} onChange={(e) => setRadius(e.target.value)} type="number" />
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
            {result && (
                <div className="text-center pt-4 space-y-2">
                    <div>
                        <Label>Area</Label>
                        <p className="text-2xl font-bold">{result.area}</p>
                    </div>
                     <div>
                        <Label>Circumference</Label>
                        <p className="text-2xl font-bold">{result.circumference}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const TriangleCalculator = () => {
    const [base, setBase] = useState('10');
    const [height, setHeight] = useState('5');
    const [result, setResult] = useState<{ area: string } | null>(null);

    const calculate = () => {
        const b = parseFloat(base);
        const h = parseFloat(height);
        if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
            setResult(null);
            return;
        }
        setResult({ area: (0.5 * b * h).toLocaleString() });
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="tri-base">Base</Label>
                    <Input id="tri-base" value={base} onChange={(e) => setBase(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="tri-height">Height</Label>
                    <Input id="tri-height" value={height} onChange={(e) => setHeight(e.target.value)} type="number" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
            {result && (
                <div className="text-center pt-4">
                    <Label>Area</Label>
                    <p className="text-2xl font-bold">{result.area}</p>
                </div>
            )}
        </div>
    );
};

const CubeCalculator = () => {
    const [side, setSide] = useState('5');
    const [result, setResult] = useState<{ volume: string; surfaceArea: string } | null>(null);

    const calculate = () => {
        const s = parseFloat(side);
        if (isNaN(s) || s <= 0) {
            setResult(null);
            return;
        }
        setResult({
            volume: (s * s * s).toLocaleString(),
            surfaceArea: (6 * s * s).toLocaleString(),
        });
    };
    
    return (
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="cube-side">Side Length</Label>
                <Input id="cube-side" value={side} onChange={(e) => setSide(e.target.value)} type="number" />
            </div>
            <Button onClick={calculate} className="w-full">Calculate</Button>
            {result && (
                <div className="text-center pt-4 space-y-2">
                    <div>
                        <Label>Volume</Label>
                        <p className="text-2xl font-bold">{result.volume}</p>
                    </div>
                     <div>
                        <Label>Surface Area</Label>
                        <p className="text-2xl font-bold">{result.surfaceArea}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


const GeometryCalculator = () => {
    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Geometry Calculator</CardTitle>
                <CardDescription>Calculate properties of common geometric shapes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="rectangle" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
                        <TabsTrigger value="circle">Circle</TabsTrigger>
                        <TabsTrigger value="triangle">Triangle</TabsTrigger>
                        <TabsTrigger value="cube">Cube</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rectangle">
                        <RectangleCalculator />
                    </TabsContent>
                    <TabsContent value="circle">
                        <CircleCalculator />
                    </TabsContent>
                    <TabsContent value="triangle">
                        <TriangleCalculator />
                    </TabsContent>
                    <TabsContent value="cube">
                        <CubeCalculator />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default GeometryCalculator;
