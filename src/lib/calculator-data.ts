
import { BrainCircuit, CalendarDays, HeartPulse, Landmark, LucideIcon, Sparkles } from 'lucide-react';

export interface CalculatorInfo {
    value: string;
    label: string;
    path: string;
    category: 'Financial' | 'Health' | 'Date & Time' | 'Math & Science' | 'Other';
    icon: LucideIcon;
    keywords?: string[];
}

export const allCalculators: CalculatorInfo[] = [
    // Financial
    { value: 'suggestions', label: 'AI Suggestions', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'ai', 'loan', 'optimization'] },
    { value: 'budget', label: 'Budget', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'expense', 'income', 'money'] },
    { value: 'comparison', label: 'Comparison', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'loan', 'compare'] },
    { value: 'compound-interest', label: 'Compound Interest', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'investment', 'savings'] },
    { value: 'calculator', label: 'EMI Calculator', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'loan', 'payment', 'interest'] },
    { value: 'fd-calculator', label: 'FD Calculator', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'fixed deposit', 'investment'] },
    { value: 'gratuity', label: 'Gratuity', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'india', 'retirement', 'salary'] },
    { value: 'gst', label: 'GST', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'tax', 'india', 'goods and services'] },
    { value: 'indian-tax', label: 'Indian Tax', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'tax', 'india', 'income'] },
    { value: 'investment', label: 'Investment', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'stocks', 'returns'] },
    { value: 'lumpsum-calculator', label: 'Lumpsum', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'investment', 'one-time'] },
    { value: 'mortgage-calculator', label: 'Mortgage', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'home', 'loan', 'property'] },
    { value: 'ppf-calculator', label: 'PPF Calculator', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'provident fund', 'india', 'savings'] },
    { value: 'rd-calculator', label: 'RD Calculator', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'recurring deposit', 'investment'] },
    { value: 'refinance', label: 'Refinancing', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'loan', 'interest', 'savings'] },
    { value: 'retirement', label: 'Retirement', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'pension', 'savings', '401k'] },
    { value: 'roi', label: 'ROI', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'return on investment'] },
    { value: 'savings', label: 'Savings', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'goal', 'money'] },
    { value: 'sip-calculator', label: 'SIP Calculator', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'systematic investment plan', 'mutual fund'] },
    { value: 'tax', label: 'US Tax', path: '/', category: 'Financial', icon: Landmark, keywords: ['finance', 'tax', 'usa', 'federal'] },

    // Health
    { value: 'age', label: 'Age', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'birthday', 'zodiac'] },
    { value: 'bmi', label: 'BMI', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'body mass index', 'weight'] },
    { value: 'bmr', label: 'BMR', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'basal metabolic rate', 'calories'] },
    { value: 'body-fat', label: 'Body Fat', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'fitness', 'physique'] },
    { value: 'calorie', label: 'Calorie', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'diet', 'macros', 'nutrition'] },
    { value: 'creatinine-clearance', label: 'Creatinine Clearance', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'kidney', 'medical', 'crcl'] },
    { value: 'due-date', label: 'Due Date', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'pregnancy', 'baby'] },
    { value: 'egfr', label: 'eGFR', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'kidney', 'glomerular filtration rate'] },
    { value: 'heart-rate', label: 'Heart Rate', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'pulse', 'exercise', 'zones'] },
    { value: 'ideal-weight', label: 'Ideal Weight', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'weight', 'fitness'] },
    { value: 'ovulation', label: 'Ovulation', path: '/personal-health-calculators', category: 'Health', icon: HeartPulse, keywords: ['health', 'fertility', 'cycle', 'pregnancy'] },

    // Date & Time
    { value: 'add-subtract-days', label: 'Add/Subtract Days', path: '/date-time-calculators', category: 'Date & Time', icon: CalendarDays, keywords: ['date', 'time', 'duration'] },
    { value: 'time-calculator', label: 'Add/Subtract Time', path: '/date-time-calculators', category: 'Date & Time', icon: CalendarDays, keywords: ['date', 'time', 'duration'] },
    { value: 'countdown', label: 'Countdown', path: '/date-time-calculators', category: 'Date & Time', icon: CalendarDays, keywords: ['date', 'time', 'timer', 'event'] },
    { value: 'date-difference', label: 'Date Difference', path: '/date-time-calculators', category: 'Date & Time', icon: CalendarDays, keywords: ['date', 'time', 'duration', 'between'] },
    { value: 'workdays', label: 'Workdays', path: '/date-time-calculators', category: 'Date & Time', icon: CalendarDays, keywords: ['date', 'time', 'business days', 'working'] },

    // Math & Science
    { value: 'algebra', label: 'Algebra', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'equation', 'linear', 'quadratic'] },
    { value: 'basic', label: 'Basic', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'arithmetic'] },
    { value: 'break-even', label: 'Break-Even', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['business', 'finance', 'profit'] },
    { value: 'chemistry', label: 'Chemistry', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['science', 'molarity', 'molecular weight'] },
    { value: 'discount', label: 'Discount', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'sale', 'percentage'] },
    { value: 'fraction', label: 'Fraction', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'arithmetic'] },
    { value: 'geometry', label: 'Geometry', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'shape', 'area', 'volume'] },
    { value: 'graphing', label: 'Graphing', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'plot', 'function', 'equation'] },
    { value: 'markup-margin', label: 'Markup & Margin', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['business', 'finance', 'profit'] },
    { value: 'percentage', label: 'Percentage', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'percent'] },
    { value: 'physics', label: 'Physics', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['science', 'force', 'energy', 'speed'] },
    { value: 'scientific', label: 'Scientific', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['math', 'log', 'sin', 'cos'] },
    { value: 'unit', label: 'Unit Converter', path: '/math-science-calculators', category: 'Math & Science', icon: BrainCircuit, keywords: ['conversion', 'length', 'weight', 'volume'] },

    // Other
    { value: 'bsa', label: 'Body Surface Area', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['medical', 'health', 'bsa'] },
    { value: 'carbon-footprint', label: 'Carbon Footprint', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['environment', 'climate', 'co2'] },
    { value: 'cooking-converter', label: 'Cooking Converter', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['food', 'recipe', 'measurement'] },
    { value: 'fuel-efficiency', label: 'Fuel Efficiency', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['car', 'vehicle', 'mpg', 'gas'] },
    { value: 'gpa', label: 'GPA', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['education', 'school', 'college', 'grades'] },
    { value: 'loan-eligibility', label: 'Loan Eligibility', path: '/other-specialized-calculators', category: 'Other', icon: Sparkles, keywords: ['finance', 'credit', 'approval'] },
];
