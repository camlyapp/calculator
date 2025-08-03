
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const atomicWeights: { [key: string]: number } = {
    'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.011, 'N': 14.007,
    'O': 15.999, 'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085,
    'P': 30.974, 'S': 32.06, 'Cl': 35.45, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078, 'Sc': 44.956,
    'Ti': 47.867, 'V': 50.942, 'Cr': 51.996, 'Mn': 54.938, 'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693,
    'Cu': 63.546, 'Zn': 65.38, 'Ga': 69.723, 'Ge': 72.630, 'As': 74.922, 'Se': 78.971, 'Br': 79.904,
    'Kr': 83.798, 'Rb': 85.468, 'Sr': 87.62, 'Y': 88.906, 'Zr': 91.224, 'Nb': 92.906, 'Mo': 95.96,
    'Tc': 98, 'Ru': 101.07, 'Rh': 102.91, 'Pd': 106.42, 'Ag': 107.87, 'Cd': 112.41, 'In': 114.82,
    'Sn': 118.71, 'Sb': 121.76, 'Te': 127.60, 'I': 126.90, 'Xe': 131.29, 'Cs': 132.91, 'Ba': 137.33,
    'La': 138.91, 'Ce': 140.12, 'Pr': 140.91, 'Nd': 144.24, 'Pm': 145, 'Sm': 150.36, 'Eu': 151.96,
    'Gd': 157.25, 'Tb': 158.93, 'Dy': 162.50, 'Ho': 164.93, 'Er': 167.26, 'Tm': 168.93, 'Yb': 173.05,
    'Lu': 174.97, 'Hf': 178.49, 'Ta': 180.95, 'W': 183.84, 'Re': 186.21, 'Os': 190.23, 'Ir': 192.22,
    'Pt': 195.08, 'Au': 196.97, 'Hg': 200.59, 'Tl': 204.38, 'Pb': 207.2, 'Bi': 208.98, 'Po': 209,
    'At': 210, 'Rn': 222, 'Fr': 223, 'Ra': 226, 'Ac': 227, 'Th': 232.04, 'Pa': 231.04, 'U': 238.03
};

const MolarityCalculator = () => {
    const [moles, setMoles] = useState('1');
    const [volume, setVolume] = useState('1'); // Liters
    const [result, setResult] = useState('');

    useEffect(() => {
        const mol = parseFloat(moles);
        const vol = parseFloat(volume);
        if (isNaN(mol) || isNaN(vol) || vol <= 0) {
            setResult('Invalid input.');
            return;
        }
        setResult(`${(mol / vol).toLocaleString()} M`);
    }, [moles, volume]);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-4">
                <div className="w-full space-y-2">
                    <Label htmlFor="moles-solute">Moles of Solute (mol)</Label>
                    <Input id="moles-solute" value={moles} onChange={(e) => setMoles(e.target.value)} type="number" />
                </div>
                <div className="w-full space-y-2">
                    <Label htmlFor="volume-solution">Volume of Solution (L)</Label>
                    <Input id="volume-solution" value={volume} onChange={(e) => setVolume(e.target.value)} type="number" />
                </div>
            </div>
            {result && (
                <div className="text-center pt-4">
                    <Label>Molarity</Label>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const MolecularWeightCalculator = () => {
    const [formula, setFormula] = useState('H2O');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        setResult('');
        if (!formula) {
            setError('Please enter a chemical formula.');
            return;
        }
        
        // Regex to parse formula: matches an uppercase letter followed by optional lowercase letters, then optional digits.
        const regex = /([A-Z][a-z]*)(\d*)/g;
        const elements = [...formula.matchAll(regex)];
        
        if (elements.length === 0) {
            setError('Invalid formula format. Example: H2O, C6H12O6');
            return;
        }

        let totalWeight = 0;
        let parsedFormula = '';
        for (const match of elements) {
            const element = match[1];
            const count = match[2] ? parseInt(match[2], 10) : 1;
            parsedFormula += element + (count > 1 ? count : '');

            if (atomicWeights[element]) {
                totalWeight += atomicWeights[element] * count;
            } else {
                setError(`Element "${element}" not found in our database.`);
                return;
            }
        }
        
        if (parsedFormula !== formula.replace(/\s/g, '')) {
             setError('Invalid characters or format in formula.');
             return;
        }

        setResult(`${totalWeight.toFixed(4)} g/mol`);
    }, [formula]);
    
    return (
        <div className="space-y-4 pt-4">
            <div className="w-full space-y-2">
                <Label htmlFor="chemical-formula">Chemical Formula</Label>
                <Input 
                    id="chemical-formula" 
                    value={formula} 
                    onChange={(e) => setFormula(e.target.value)} 
                    type="text" 
                    placeholder="e.g., C6H12O6" 
                />
            </div>
            {error && <p className="text-destructive text-center mt-4">{error}</p>}
            {result && !error && (
                <div className="text-center pt-4">
                    <Label>Molecular Weight</Label>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};


const ChemistryCalculator = () => {
    return (
        <Card className="w-full max-w-lg shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Chemistry Calculator</CardTitle>
                <CardDescription>Perform common chemistry calculations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="molarity" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="molarity">Molarity</TabsTrigger>
                        <TabsTrigger value="molecular-weight">Molecular Weight</TabsTrigger>
                    </TabsList>
                    <TabsContent value="molarity">
                        <MolarityCalculator />
                    </TabsContent>
                    <TabsContent value="molecular-weight">
                        <MolecularWeightCalculator />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ChemistryCalculator;
