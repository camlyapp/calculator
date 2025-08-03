
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { addDays, format, isValid, differenceInDays, subDays } from 'date-fns';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type CalculationMethod = 'lmp' | 'conception' | 'ovulation' | 'ivf_retrieval' | 'ivf_day3' | 'ivf_day5' | 'ultrasound_ga' | 'ultrasound_crl' | 'fundal_height';

const DueDateCalculator = () => {
    const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('lmp');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [cycleLength, setCycleLength] = useState('28');
    
    // State for ultrasound method
    const [ultrasoundDate, setUltrasoundDate] = useState<Date | undefined>(new Date());
    const [weeksAtUltrasound, setWeeksAtUltrasound] = useState('8');
    const [daysAtUltrasound, setDaysAtUltrasound] = useState('0');
    const [crl, setCrl] = useState('15'); // Crown-Rump Length in mm

     // State for Fundal Height
    const [fundalHeight, setFundalHeight] = useState('24'); // in cm

    const [result, setResult] = useState<{
        dueDate: Date;
        gestationalAge: string;
        trimester: number;
        conceptionDate: Date;
        methodUsed: string;
        daysUntilDue: number;
        milestones: { name: string; date: string; }[];
    } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const calculateDueDate = () => {
        if (!isMounted) return;

        let dueDate: Date | undefined;
        let lmpFromConception: Date | undefined;
        let methodUsed = '';
        const avgCycleLength = parseInt(cycleLength) || 28;

        const dateForCalc = calculationMethod.startsWith('ultrasound') || calculationMethod === 'fundal_height' ? ultrasoundDate : selectedDate;

        if (!dateForCalc || !isValid(dateForCalc)) {
            setResult(null);
            return;
        }
        
        switch (calculationMethod) {
            case 'lmp':
                dueDate = addDays(dateForCalc, 280 + (avgCycleLength - 28));
                lmpFromConception = subDays(dueDate, 280);
                methodUsed = `Last Menstrual Period (Cycle: ${avgCycleLength} days)`;
                break;
            case 'conception':
                lmpFromConception = subDays(dateForCalc, 14);
                methodUsed = "Date of Conception";
                break;
             case 'ovulation':
                dueDate = addDays(dateForCalc, 266);
                lmpFromConception = subDays(dueDate, 280);
                methodUsed = "Ovulation Date";
                break;
            case 'ivf_retrieval':
                lmpFromConception = subDays(dateForCalc, 14);
                methodUsed = "IVF (Egg Retrieval Date)";
                break;
            case 'ivf_day3':
                lmpFromConception = subDays(dateForCalc, 17); // 14 days ovulation + 3 days embryo
                methodUsed = "IVF Transfer (3-Day Embryo)";
                break;
             case 'ivf_day5':
                lmpFromConception = subDays(dateForCalc, 19); // 14 days ovulation + 5 days embryo
                methodUsed = "IVF Transfer (5-Day Embryo)";
                break;
            case 'ultrasound_ga':
                const weeks = parseInt(weeksAtUltrasound) || 0;
                const days = parseInt(daysAtUltrasound) || 0;
                const totalDaysGestationAtUltrasound = weeks * 7 + days;
                const estLmpFromGA = subDays(dateForCalc, totalDaysGestationAtUltrasound);
                dueDate = addDays(estLmpFromGA, 280);
                lmpFromConception = subDays(dueDate, 280);
                methodUsed = `Ultrasound by Gestational Age (${weeks}w ${days}d)`;
                break;
            case 'ultrasound_crl':
                const crlMm = parseFloat(crl);
                if (isNaN(crlMm) || crlMm < 6 || crlMm > 140) { // Valid CRL range approx 6-14 weeks
                    setResult(null); return;
                }
                // Using Robinson & Fleming formula: GA(days) = 8.052 * sqrt(CRL(mm)) + 23.73
                const gaDaysFromCrl = 8.052 * Math.sqrt(crlMm) + 23.73;
                const estLmpFromCrl = subDays(dateForCalc, Math.round(gaDaysFromCrl));
                dueDate = addDays(estLmpFromCrl, 280);
                lmpFromConception = subDays(dueDate, 280);
                methodUsed = `Ultrasound by CRL (${crlMm}mm)`;
                break;
             case 'fundal_height':
                const fhCm = parseInt(fundalHeight);
                if (isNaN(fhCm) || fhCm < 18 || fhCm > 40) { // Valid fundal height range
                     setResult(null); return;
                }
                // McDonald's Rule: Gestational Age in weeks ≈ Fundal Height in cm
                const estGaWeeksFromFh = fhCm;
                const estLmpFromFh = subDays(dateForCalc, estGaWeeksFromFh * 7);
                dueDate = addDays(estLmpFromFh, 280);
                lmpFromConception = subDays(dueDate, 280);
                methodUsed = `Fundal Height (${fhCm}cm)`;
                break;
        }
        
        if (!dueDate && lmpFromConception) {
            dueDate = addDays(lmpFromConception, 280);
        }
        
        if (dueDate && lmpFromConception && isValid(dueDate)) {
            const conceptionDate = addDays(lmpFromConception, 14);
            const today = new Date();
            const gestationalDays = differenceInDays(today, lmpFromConception);

            if (gestationalDays < 0 || gestationalDays > 300) { // Plausible range
                setResult(null);
                return;
            }

            const weeks = Math.floor(gestationalDays / 7);
            const days = gestationalDays % 7;
            
            let trimester = 1;
            if (weeks >= 28) trimester = 3;
            else if (weeks >= 14) trimester = 2;
            
            const milestones = [
                { name: "Fetal Heartbeat Detectable", date: format(addDays(lmpFromConception, 6 * 7), 'PPP')},
                { name: "End of 1st Trimester", date: format(addDays(lmpFromConception, 14 * 7 -1), 'PPP')},
                { name: "Start of 2nd Trimester", date: format(addDays(lmpFromConception, 14 * 7), 'PPP')},
                { name: "Estimated Viability", date: format(addDays(lmpFromConception, 24 * 7), 'PPP')},
                { name: "End of 2nd Trimester", date: format(addDays(lmpFromConception, 28 * 7 - 1), 'PPP')},
                { name: "Start of 3rd Trimester", date: format(addDays(lmpFromConception, 28 * 7), 'PPP')},
            ];

            setResult({
                dueDate,
                gestationalAge: `${weeks} weeks, ${days} days`,
                trimester,
                conceptionDate,
                methodUsed,
                daysUntilDue: differenceInDays(dueDate, today),
                milestones,
            });
        } else {
            setResult(null);
        }
    };
    
    useEffect(() => {
       calculateDueDate();
    }, [selectedDate, calculationMethod, cycleLength, ultrasoundDate, weeksAtUltrasound, daysAtUltrasound, crl, fundalHeight, isMounted]);

    if (!isMounted) {
        return null;
    }
    
    const getLabelForDate = () => {
        switch(calculationMethod) {
            case 'lmp': return "First Day of Last Period";
            case 'conception': return "Date of Conception";
            case 'ovulation': return "Date of Ovulation";
            case 'ivf_retrieval': return "Date of Egg Retrieval";
            case 'ivf_day3':
            case 'ivf_day5':
                return "Date of Embryo Transfer";
            case 'ultrasound_ga':
            case 'ultrasound_crl':
                return "Date of Ultrasound";
            case 'fundal_height':
                return "Date of Measurement";
            default: return "Date";
        }
    }

    const DatePicker = ({date, setDate}: {date?: Date, setDate: (d?: Date) => void}) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );

    const renderInputs = (method: CalculationMethod) => {
        switch (method) {
            case 'lmp':
                return (
                    <div className='space-y-4'>
                        <div className="space-y-2">
                            <Label>{getLabelForDate()}</Label>
                            <DatePicker date={selectedDate} setDate={setSelectedDate} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cycle-length">Average Cycle Length (Days)</Label>
                            <Input id="cycle-length" value={cycleLength} onChange={e => setCycleLength(e.target.value)} type="number" />
                        </div>
                    </div>
                );
            case 'conception':
            case 'ovulation':
            case 'ivf_retrieval':
            case 'ivf_day3':
            case 'ivf_day5':
                return (
                    <div className='space-y-4'>
                        <div className="space-y-2">
                            <Label>{getLabelForDate()}</Label>
                            <DatePicker date={selectedDate} setDate={setSelectedDate} />
                        </div>
                    </div>
                );
            case 'ultrasound_ga':
                 return (
                    <div className="space-y-4 p-4 border rounded-lg">
                        <p className="text-sm font-semibold text-primary">Ultrasound by Gestational Age</p>
                        <div className="space-y-2">
                            <Label>{getLabelForDate()}</Label>
                            <DatePicker date={ultrasoundDate} setDate={setUltrasoundDate} />
                        </div>
                        <div className="flex gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="weeks-us">Weeks</Label>
                                <Input id="weeks-us" value={weeksAtUltrasound} onChange={e => setWeeksAtUltrasound(e.target.value)} type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="days-us">Days</Label>
                                <Input id="days-us" value={daysAtUltrasound} onChange={e => setDaysAtUltrasound(e.target.value)} type="number" />
                            </div>
                        </div>
                    </div>
                );
             case 'ultrasound_crl':
                return (
                    <div className="space-y-4 p-4 border rounded-lg">
                        <p className="text-sm font-semibold text-primary">Ultrasound by CRL</p>
                         <div className="space-y-2">
                            <Label>{getLabelForDate()}</Label>
                            <DatePicker date={ultrasoundDate} setDate={setUltrasoundDate} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crl-mm">Crown-Rump Length (mm)</Label>
                            <Input id="crl-mm" value={crl} onChange={e => setCrl(e.target.value)} type="number" />
                        </div>
                    </div>
                );
            case 'fundal_height':
                 return (
                    <div className="space-y-4 p-4 border rounded-lg">
                        <p className="text-sm font-semibold text-primary">Fundal Height</p>
                        <div className="space-y-2">
                           <Label>{getLabelForDate()}</Label>
                           <DatePicker date={ultrasoundDate} setDate={setUltrasoundDate} />
                       </div>
                       <div className="space-y-2">
                           <Label htmlFor="fundal-cm">Fundal Height (cm)</Label>
                           <Input id="fundal-cm" value={fundalHeight} onChange={e => setFundalHeight(e.target.value)} type="number" />
                       </div>
                   </div>
               );
            default:
                return null;
        }
    }

    const commonMethods: CalculationMethod[] = ['lmp', 'conception', 'ovulation'];
    const ivfMethods: CalculationMethod[] = ['ivf_retrieval', 'ivf_day3', 'ivf_day5'];
    const clinicalMethods: CalculationMethod[] = ['ultrasound_ga', 'ultrasound_crl', 'fundal_height'];

    const getMethodName = (method: CalculationMethod) => {
        switch(method) {
            case 'lmp': return "LMP";
            case 'conception': return "Conception";
            case 'ovulation': return "Ovulation";
            case 'ivf_retrieval': return "Egg Retrieval";
            case 'ivf_day3': return "3-Day Transfer";
            case 'ivf_day5': return "5-Day Transfer";
            case 'ultrasound_ga': return "Ultrasound (GA)";
            case 'ultrasound_crl': return "Ultrasound (CRL)";
            case 'fundal_height': return "Fundal Height";
            default: return "";
        }
    }


    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Pregnancy Due Date Calculator</CardTitle>
                <CardDescription>Estimate your due date with various methods and get key pregnancy milestones.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className='flex-1 space-y-4'>
                        <Tabs defaultValue="common" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="common">Common</TabsTrigger>
                                <TabsTrigger value="ivf">IVF</TabsTrigger>
                                <TabsTrigger value="clinical">Clinical</TabsTrigger>
                            </TabsList>
                            <TabsContent value="common" className="pt-4">
                                <div className="space-y-2">
                                    <Label>Method</Label>
                                    <Select value={calculationMethod} onValueChange={(val) => setCalculationMethod(val as CalculationMethod)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {commonMethods.map(m => <SelectItem key={m} value={m}>{getMethodName(m)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4">{renderInputs(calculationMethod)}</div>
                            </TabsContent>
                             <TabsContent value="ivf" className="pt-4">
                               <div className="space-y-2">
                                    <Label>Method</Label>
                                    <Select value={calculationMethod} onValueChange={(val) => setCalculationMethod(val as CalculationMethod)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ivfMethods.map(m => <SelectItem key={m} value={m}>{getMethodName(m)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4">{renderInputs(calculationMethod)}</div>
                            </TabsContent>
                             <TabsContent value="clinical" className="pt-4">
                                <div className="space-y-2">
                                    <Label>Method</Label>
                                    <Select value={calculationMethod} onValueChange={(val) => setCalculationMethod(val as CalculationMethod)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {clinicalMethods.map(m => <SelectItem key={m} value={m}>{getMethodName(m)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4">{renderInputs(calculationMethod)}</div>
                            </TabsContent>
                        </Tabs>
                        
                         <Button onClick={calculateDueDate} className="w-full">Recalculate</Button>
                    </div>
                    
                    {result ? (
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t space-y-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-primary">Estimated Due Date</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-4xl font-bold">{format(result.dueDate, 'PPP')}</p>
                                    <p className="text-lg text-accent">{result.daysUntilDue > 0 ? `${result.daysUntilDue} days to go!` : 'The day is here!'}</p>
                                    <p className="text-xs text-muted-foreground mt-2">Based on {result.methodUsed}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Status</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                                     <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Gestational Age</p>
                                        <p className="font-bold text-lg">{result.gestationalAge}</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Current Trimester</p>
                                        <p className="font-bold text-lg">{result.trimester}</p>
                                    </div>
                                      <div className="p-4 bg-muted rounded-lg col-span-full">
                                        <p className="text-sm text-muted-foreground">Estimated Conception Date</p>
                                        <p className="font-bold text-lg">{format(result.conceptionDate, 'PPP')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Milestones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.milestones.map(m => (
                                        <div key={m.name} className="flex justify-between text-sm p-2 bg-muted rounded-lg">
                                            <span>{m.name}</span>
                                            <span className="font-semibold">{m.date}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex-1 mt-8 md:mt-0 pt-8 md:pt-0 md:border-l md:pl-8 border-t flex items-center justify-center">
                            <p className="text-muted-foreground">Please provide valid inputs to see your results.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DueDateCalculator;
