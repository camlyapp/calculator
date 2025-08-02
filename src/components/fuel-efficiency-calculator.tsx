
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MILES_PER_KM = 0.621371;
const LITERS_PER_GALLON = 3.78541;

const FuelEfficiencyCalculator = () => {
    const [distance, setDistance] = useState('250');
    const [fuel, setFuel] = useState('10');
    const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
    const [fuelUnit, setFuelUnit] = useState<'gallons' | 'liters'>('gallons');

    const { mpg, kml } = useMemo(() => {
        const dist = parseFloat(distance);
        const fuelVol = parseFloat(fuel);

        if (isNaN(dist) || isNaN(fuelVol) || dist <= 0 || fuelVol <= 0) {
            return { mpg: 0, kml: 0 };
        }
        
        const distanceInMiles = distanceUnit === 'miles' ? dist : dist * MILES_PER_KM;
        const fuelInGallons = fuelUnit === 'gallons' ? fuelVol : fuelVol / LITERS_PER_GALLON;

        const calculatedMpg = distanceInMiles / fuelInGallons;
        
        const distanceInKm = distanceUnit === 'km' ? dist : dist / MILES_PER_KM;
        const fuelInLiters = fuelUnit === 'liters' ? fuelVol : fuelVol * LITERS_PER_GALLON;

        const calculatedKml = distanceInKm / fuelInLiters;

        return { mpg: calculatedMpg, kml: calculatedKml };

    }, [distance, fuel, distanceUnit, fuelUnit]);

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Fuel Efficiency Calculator</CardTitle>
                <CardDescription>
                    Calculate your vehicle's fuel economy in MPG and KM/L.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="distance">Distance Traveled</Label>
                        <div className="flex gap-2">
                             <Input id="distance" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                             <Select value={distanceUnit} onValueChange={(val) => setDistanceUnit(val as 'miles' | 'km')}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="miles">Miles</SelectItem>
                                    <SelectItem value="km">KM</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="fuel">Fuel Consumed</Label>
                        <div className="flex gap-2">
                             <Input id="fuel" type="number" value={fuel} onChange={(e) => setFuel(e.target.value)} />
                             <Select value={fuelUnit} onValueChange={(val) => setFuelUnit(val as 'gallons' | 'liters')}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gallons">Gallons</SelectItem>
                                    <SelectItem value="liters">Liters</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                </div>

                {(mpg > 0 || kml > 0) && (
                    <div className="mt-8 pt-6 border-t">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle>Efficiency Result</CardTitle>
                        </CardHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <p className="text-muted-foreground">Miles Per Gallon</p>
                                <p className="text-3xl font-bold text-primary">{mpg.toFixed(2)} MPG</p>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <p className="text-muted-foreground">Kilometers Per Liter</p>
                                <p className="text-3xl font-bold text-accent">{kml.toFixed(2)} KM/L</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FuelEfficiencyCalculator;
