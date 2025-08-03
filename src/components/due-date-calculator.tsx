
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDays, subDays, format, isValid, differenceInDays, eachDayOfInterval, getMonth, getYear } from 'date-fns';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Baby, CalendarIcon, ChevronLeft, ChevronRight, Utensils, Syringe, HeartPulse, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getPregnancyAdviceAction } from '@/app/actions';
import type { GetPregnancyAdviceOutput } from '@/ai/flows/get-pregnancy-advice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

type CalculationMethod = 'lmp' | 'conception' | 'ovulation' | 'ivf_retrieval' | 'ivf_day3' | 'ivf_day5' | 'ultrasound_ga' | 'ultrasound_crl' | 'fundal_height';

interface DueDateResult {
    dueDate: Date;
    gestationalAge: string;
    gestationalWeek: number;
    trimester: number;
    conceptionDate: Date;
    methodUsed: string;
    daysUntilDue: number;
    milestones: { name: string; date: string; }[];
}

interface CyclePrediction {
    ovulationDate: Date;
    fertileWindowStart: Date;
    fertileWindowEnd: Date;
    nextPeriodDate: Date;
}

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

    const [result, setResult] = useState<DueDateResult | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    const [predictions, setPredictions] = useState<CyclePrediction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [aiAdvice, setAiAdvice] = useState<GetPregnancyAdviceOutput | null>(null);
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(selectedDate);
        }
    }, [selectedDate])

    const fetchPregnancyAdvice = useCallback(async (week: number) => {
        if (week < 1 || week > 42) return;
        setIsLoadingAdvice(true);
        setAiAdvice(null);
        try {
            const response = await getPregnancyAdviceAction(week);
            if (response.advice) {
                setAiAdvice(response.advice);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error("Failed to fetch pregnancy advice:", error);
        } finally {
            setIsLoadingAdvice(false);
        }
    }, []);

    const calculateDueDate = useCallback(() => {
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
                lmpFromConception = dateForCalc;
                methodUsed = `Last Menstrual Period (Cycle: ${avgCycleLength} days)`;
                dueDate = addDays(dateForCalc, 280 + (avgCycleLength - 28));
                break;
            case 'conception':
                lmpFromConception = subDays(dateForCalc, 14);
                methodUsed = "Date of Conception";
                break;
             case 'ovulation':
                lmpFromConception = subDays(dateForCalc, 14);
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
                lmpFromConception = subDays(dateForCalc, totalDaysGestationAtUltrasound);
                methodUsed = `Ultrasound by Gestational Age (${weeks}w ${days}d)`;
                break;
            case 'ultrasound_crl':
                const crlMm = parseFloat(crl);
                if (isNaN(crlMm) || crlMm < 6 || crlMm > 140) { // Valid CRL range approx 6-14 weeks
                    setResult(null); return;
                }
                // Using Robinson & Fleming formula: GA(days) = 8.052 * sqrt(CRL(mm)) + 23.73
                const gaDaysFromCrl = 8.052 * Math.sqrt(crlMm) + 23.73;
                lmpFromConception = subDays(dateForCalc, Math.round(gaDaysFromCrl));
                methodUsed = `Ultrasound by CRL (${crlMm}mm)`;
                break;
             case 'fundal_height':
                const fhCm = parseInt(fundalHeight);
                if (isNaN(fhCm) || fhCm < 18 || fhCm > 40) { // Valid fundal height range
                     setResult(null); return;
                }
                // McDonald's Rule: Gestational Age in weeks ≈ Fundal Height in cm
                const estGaWeeksFromFh = fhCm;
                lmpFromConception = subDays(dateForCalc, estGaWeeksFromFh * 7);
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
                setAiAdvice(null);
                return;
            }

            const gestationalWeek = Math.floor(gestationalDays / 7);
            const days = gestationalDays % 7;
            
            let trimester = 1;
            if (gestationalWeek >= 28) trimester = 3;
            else if (gestationalWeek >= 14) trimester = 2;
            
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
                gestationalAge: `${gestationalWeek} weeks, ${days} days`,
                gestationalWeek,
                trimester,
                conceptionDate,
                methodUsed,
                daysUntilDue: differenceInDays(dueDate, today),
                milestones,
            });
            fetchPregnancyAdvice(gestationalWeek);

            const newPredictions: CyclePrediction[] = [];
            let currentLmp = lmpFromConception;
             for (let i = 0; i < 6; i++) { // Calculate for next 6 cycles
                const nextPeriod = addDays(currentLmp, avgCycleLength);
                const ovulationDay = subDays(nextPeriod, 14);
                
                newPredictions.push({
                    ovulationDate: ovulationDay,
                    fertileWindowStart: subDays(ovulationDay, 5),
                    fertileWindowEnd: ovulationDay,
                    nextPeriodDate: nextPeriod,
                });
                currentLmp = nextPeriod;
            }
            setPredictions(newPredictions);

        } else {
            setResult(null);
            setAiAdvice(null);
        }
    }, [isMounted, calculationMethod, selectedDate, cycleLength, ultrasoundDate, weeksAtUltrasound, daysAtUltrasound, crl, fundalHeight, fetchPregnancyAdvice]);
    
    useEffect(() => {
       calculateDueDate();
    }, [calculateDueDate]);

    const useMemoResult = useMemo(() => {
        const fertile: Date[] = [];
        const ovulation: Date[] = [];
        const period: Date[] = [];

        predictions.forEach(p => {
            fertile.push(...eachDayOfInterval({ start: p.fertileWindowStart, end: p.fertileWindowEnd }));
            ovulation.push(p.ovulationDate);
            // Assuming period lasts 5 days for visualization
            period.push(...eachDayOfInterval({ start: p.nextPeriodDate, end: addDays(p.nextPeriodDate, 4)}));
        });
        return { fertileDays: fertile, ovulationDays: ovulation, periodDays: period };
    }, [predictions]);

    const { fertileDays, ovulationDays, periodDays } = useMemoResult;

    if (!isMounted) {
        return null;
    }
    
    const changeMonth = (amount: number) => {
        setCurrentMonth(prev => addDays(prev, amount * 30)); // Approximate month change
    }

    const currentPrediction = predictions.find(p => getMonth(p.ovulationDate) === getMonth(currentMonth) && getYear(p.ovulationDate) === getYear(currentMonth)) || predictions[0];
    
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
    
     const handleTabChange = (tab: string) => {
        if (tab === 'common') setCalculationMethod('lmp');
        else if (tab === 'ivf') setCalculationMethod('ivf_retrieval');
        else if (tab === 'clinical') setCalculationMethod('ultrasound_ga');
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Pregnancy Due Date Calculator</CardTitle>
                <CardDescription>Estimate your due date and get AI-powered weekly insights for your pregnancy journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className='flex-1 space-y-4'>
                        <Tabs defaultValue="common" className="w-full" onValueChange={handleTabChange}>
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
                        <div className="flex-1 mt-8 lg:mt-0 pt-8 lg:pt-0 lg:border-l lg:pl-8 border-t w-full space-y-6">
                            <Card className="bg-secondary/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className='text-center'>Your Pregnancy Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-4 rounded-lg bg-background">
                                        <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                                        <p className="text-2xl font-bold text-primary">{format(result.dueDate, 'PPP')}</p>
                                        <p className="text-sm text-muted-foreground">({result.daysUntilDue} days to go)</p>
                                    </div>
                                    <div className="grid grid-cols-2 text-center gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Gestation</p>
                                            <p className="font-bold text-lg">{result.gestationalAge}</p>
                                        </div>
                                         <div>
                                            <p className="text-sm text-muted-foreground">Trimester</p>
                                            <p className="font-bold text-lg">{result.trimester}</p>
                                        </div>
                                         <div className="col-span-2">
                                            <p className="text-sm text-muted-foreground">Estimated Conception Date</p>
                                            <p className="font-bold text-lg">{format(result.conceptionDate, 'PPP')}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle>Key Milestones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.milestones.map(m => (
                                        <div key={m.name} className="flex justify-between text-sm p-2 bg-muted rounded-md">
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
                 {isLoadingAdvice && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading weekly insights...</p>
                    </div>
                )}
                {aiAdvice && result && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Weekly Insights for Week {result.gestationalWeek}</CardTitle>
                            <CardDescription>Personalized information for your current stage of pregnancy, powered by AI.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full" defaultValue="baby">
                                <AccordionItem value="baby">
                                    <AccordionTrigger><Baby className="mr-2 h-5 w-5 text-primary" />Baby's Development</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm dark:prose-invert">
                                        <p>{aiAdvice.babyDevelopment}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="mom">
                                    <AccordionTrigger><HeartPulse className="mr-2 h-5 w-5 text-primary" />Changes for Mom</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm dark:prose-invert">
                                       <p>{aiAdvice.momChanges}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="nutrition">
                                    <AccordionTrigger><Utensils className="mr-2 h-5 w-5 text-primary" />Nutrition & Food</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm dark:prose-invert">
                                        <ul>{aiAdvice.nutritionTips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="vaccines">
                                    <AccordionTrigger><Syringe className="mr-2 h-5 w-5 text-primary" />Vaccine Information</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm dark:prose-invert">
                                       <p>{aiAdvice.vaccineInfo}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="tips">
                                    <AccordionTrigger><HeartPulse className="mr-2 h-5 w-5 text-primary" />General Tips</AccordionTrigger>
                                    <AccordionContent className="prose prose-sm dark:prose-invert">
                                        <ul>{aiAdvice.generalTips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

export default DueDateCalculator;
