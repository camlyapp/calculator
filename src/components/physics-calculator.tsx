
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SpeedCalculator = () => {
    const [distance, setDistance] = useState('100'); // meters
    const [time, setTime] = useState('10');       // seconds
    const [result, setResult] = useState('');

    const calculate = () => {
        const d = parseFloat(distance);
        const t = parseFloat(time);
        if (isNaN(d) || isNaN(t) || t <= 0) {
            setResult('Invalid input.');
            return;
        }
        setResult(`${(d / t).toLocaleString()} m/s`);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="speed-distance">Distance (meters)</Label>
                    <Input id="speed-distance" value={distance} onChange={(e) => setDistance(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="speed-time">Time (seconds)</Label>
                    <Input id="speed-time" value={time} onChange={(e) => setTime(e.target.value)} type="number" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Calculate Speed</Button>
            {result && (
                <div className="text-center pt-4">
                    <Label>Result</Label>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const ForceCalculator = () => {
    const [mass, setMass] = useState('10'); // kg
    const [acceleration, setAcceleration] = useState('9.8'); // m/s^2
    const [result, setResult] = useState('');

    const calculate = () => {
        const m = parseFloat(mass);
        const a = parseFloat(acceleration);
        if (isNaN(m) || isNaN(a)) {
            setResult('Invalid input.');
            return;
        }
        setResult(`${(m * a).toLocaleString()} N`);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="force-mass">Mass (kg)</Label>
                    <Input id="force-mass" value={mass} onChange={(e) => setMass(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="force-accel">Acceleration (m/s²)</Label>
                    <Input id="force-accel" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} type="number" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Calculate Force</Button>
            {result && (
                <div className="text-center pt-4">
                    <Label>Result (Force)</Label>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const EnergyCalculator = () => {
    const [mass, setMass] = useState('2'); // kg
    const [velocity, setVelocity] = useState('10'); // m/s
    const [height, setHeight] = useState('5'); // meters
    const [result, setResult] = useState<{ ke: string, pe: string } | null>(null);

    const calculate = () => {
        const m = parseFloat(mass);
        const v = parseFloat(velocity);
        const h = parseFloat(height);
        const g = 9.8; // Gravity constant

        if (isNaN(m) || isNaN(v) || isNaN(h)) {
            setResult(null);
            return;
        }
        
        const ke = 0.5 * m * v * v;
        const pe = m * g * h;
        
        setResult({
            ke: `${ke.toLocaleString()} Joules`,
            pe: `${pe.toLocaleString()} Joules`,
        });
    };

    return (
        <div className="space-y-4 pt-4">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="energy-mass">Mass (kg)</Label>
                    <Input id="energy-mass" value={mass} onChange={(e) => setMass(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="energy-velocity">Velocity (m/s)</Label>
                    <Input id="energy-velocity" value={velocity} onChange={(e) => setVelocity(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="energy-height">Height (meters)</Label>
                    <Input id="energy-height" value={height} onChange={(e) => setHeight(e.target.value)} type="number" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Calculate Energy</Button>
            {result && (
                <div className="text-center pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Kinetic Energy</Label>
                        <p className="text-2xl font-bold">{result.ke}</p>
                    </div>
                    <div>
                        <Label>Potential Energy</Label>
                        <p className="text-2xl font-bold">{result.pe}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const PhysicsCalculator = () => {
    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Physics Calculator</CardTitle>
                <CardDescription>Calculate properties for common physics scenarios.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="speed" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                        <TabsTrigger value="speed">Speed</TabsTrigger>
                        <TabsTrigger value="force">Force</TabsTrigger>
                        <TabsTrigger value="energy">Energy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="speed">
                        <SpeedCalculator />
                    </TabsContent>
                    <TabsContent value="force">
                        <ForceCalculator />
                    </TabsContent>
                    <TabsContent value="energy">
                        <EnergyCalculator />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PhysicsCalculator;
