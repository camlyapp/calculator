
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

// Emission Factors (approximations)
// Electricity: kg CO2e per kWh (US average)
const EF_ELECTRICITY = 0.4;
// Gasoline: kg CO2e per gallon
const EF_GASOLINE = 8.89;
// Short-haul flight (< 3 hours): kg CO2e per flight
const EF_FLIGHT_SHORT = 200;
// Long-haul flight (> 3 hours): kg CO2e per flight
const EF_FLIGHT_LONG = 800;
// Waste: kg CO2e per kg of waste
const EF_WASTE = 0.57;


const CarbonFootprintCalculator = () => {
    const [electricity, setElectricity] = useState('400'); // kWh/month
    const [mileage, setMileage] = useState('100'); // miles/week
    const [mpg, setMpg] = useState('25'); // miles per gallon
    const [flightsShort, setFlightsShort] = useState('2'); // per year
    const [flightsLong, setFlightsLong] = useState('1'); // per year
    const [waste, setWaste] = useState([50]); // % of average

    const [result, setResult] = useState<{ total: number, breakdown: Record<string, number> } | null>(null);

    const calculateFootprint = () => {
        const el = parseFloat(electricity) || 0;
        const mi = parseFloat(mileage) || 0;
        const fuelEfficiency = parseFloat(mpg) || 1;
        const fs = parseFloat(flightsShort) || 0;
        const fl = parseFloat(flightsLong) || 0;
        const wa = waste[0] || 0;

        // Calculations (annual)
        const electricityFootprint = el * 12 * EF_ELECTRICITY;
        
        const gallonsPerWeek = mi / fuelEfficiency;
        const transportFootprint = (gallonsPerWeek * 52) * EF_GASOLINE;

        const flightFootprint = (fs * EF_FLIGHT_SHORT) + (fl * EF_FLIGHT_LONG);

        // Assume average household waste is ~10kg/week. Slider is a proxy.
        const wasteFootprint = (wa / 100) * 10 * 52 * EF_WASTE;

        const totalFootprint = electricityFootprint + transportFootprint + flightFootprint + wasteFootprint;

        setResult({
            total: totalFootprint,
            breakdown: {
                'Electricity': electricityFootprint,
                'Vehicle': transportFootprint,
                'Flights': flightFootprint,
                'Waste': wasteFootprint,
            }
        });
    };
    
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Carbon Footprint Calculator</CardTitle>
                <CardDescription>
                    Estimate your annual carbon footprint based on your lifestyle.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Electricity Section */}
                        <div className="space-y-2 p-4 border rounded-lg">
                             <Label htmlFor="electricity" className='font-semibold'>Monthly Electricity Usage (kWh)</Label>
                            <Input id="electricity" type="number" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
                        </div>
                        
                        {/* Transport Section */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <Label className='font-semibold'>Transportation</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label htmlFor="mileage">Weekly Car Mileage</Label>
                                    <Input id="mileage" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="mpg">Vehicle MPG</Label>
                                    <Input id="mpg" type="number" value={mpg} onChange={(e) => setMpg(e.target.value)} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="flights-short">Short Flights (/year)</Label>
                                    <Input id="flights-short" type="number" value={flightsShort} onChange={(e) => setFlightsShort(e.target.value)} />
                                </div>
                                 <div className='space-y-2'>
                                    <Label htmlFor="flights-long">Long Flights (/year)</Label>
                                    <Input id="flights-long" type="number" value={flightsLong} onChange={(e) => setFlightsLong(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Waste Section */}
                    <div className="space-y-2 p-4 border rounded-lg">
                         <Label htmlFor="waste" className='font-semibold'>Household Waste (Compared to average)</Label>
                         <p className="text-sm text-muted-foreground">Adjust the slider to estimate your household waste.</p>
                        <Slider
                            id="waste"
                            defaultValue={[50]}
                            max={200}
                            step={10}
                            onValueChange={setWaste}
                            className="pt-2"
                        />
                        <p className='text-center font-bold'>{waste[0]}%</p>
                    </div>

                    <Button onClick={calculateFootprint} className="w-full" size="lg">Calculate Footprint</Button>
                </div>
                
                {result && (
                    <div className="mt-8 pt-8">
                        <Separator />
                        <CardHeader className="text-center">
                            <CardTitle>Your Estimated Annual Footprint</CardTitle>
                        </CardHeader>
                        <div className="text-center">
                            <p className="text-5xl font-bold text-primary">{result.total.toLocaleString(undefined, {maximumFractionDigits: 0})} kg CO₂e</p>
                            <p className="text-muted-foreground mt-2">(Kilograms of CO2 equivalent per year)</p>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold text-center mb-4">Breakdown by Category</h4>
                            <div className="space-y-3">
                            {Object.entries(result.breakdown).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{key}</span>
                                        <span className="text-sm font-medium">{value.toLocaleString(undefined, {maximumFractionDigits: 0})} kg</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2.5">
                                        <div 
                                            className="bg-accent h-2.5 rounded-full" 
                                            style={{ width: `${(value / result.total) * 100}%`}}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CarbonFootprintCalculator;
