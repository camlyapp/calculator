
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BasicCalculator = () => {
    const [currentOperand, setCurrentOperand] = useState('0');
    const [previousOperand, setPreviousOperand] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [overwrite, setOverwrite] = useState(true);

    const addDigit = (digit: string) => {
        if (digit === '.' && currentOperand.includes('.')) return;
        if (overwrite) {
            setCurrentOperand(digit);
            setOverwrite(false);
        } else {
            setCurrentOperand(prev => (prev === '0' && digit !== '.') ? digit : prev + digit);
        }
    };

    const chooseOperation = (selectedOperation: string) => {
        if (previousOperand !== null && !overwrite) {
            calculate();
        }
        
        setOperation(selectedOperation);
        setPreviousOperand(currentOperand);
        setOverwrite(true);
    };

    const calculate = () => {
        if (operation === null || previousOperand === null) return;

        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        let computation: number = 0;
        switch (operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '÷': 
                if (current === 0) {
                    setCurrentOperand("Error");
                    setPreviousOperand(null);
                    setOperation(null);
                    setOverwrite(true);
                    return;
                }
                computation = prev / current; 
                break;
        }
        setCurrentOperand(computation.toString());
        setOperation(null);
        setPreviousOperand(null);
        setOverwrite(true);
    };

    const clear = () => {
        setCurrentOperand('0');
        setPreviousOperand(null);
        setOperation(null);
        setOverwrite(true);
    };
    
    const renderButton = (label: string, onClick: () => void, className: string = '') => (
        <Button
            onClick={onClick}
            className={`text-2xl h-16 ${className}`}
            variant={['+', '-', '*', '÷', '='].includes(label) ? 'secondary' : 'outline'}
        >
            {label}
        </Button>
    );

    return (
        <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Basic Calculator</CardTitle>
                <CardDescription>A simple calculator for everyday math.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted rounded-lg p-4 text-right mb-4 overflow-x-auto">
                    <p className="text-4xl font-mono break-all">{currentOperand}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {renderButton('C', clear, 'col-span-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground')}
                    {renderButton('÷', () => chooseOperation('÷'))}
                    {renderButton('*', () => chooseOperation('*'))}
                    
                    {renderButton('7', () => addDigit('7'))}
                    {renderButton('8', () => addDigit('8'))}
                    {renderButton('9', () => addDigit('9'))}
                    {renderButton('-', () => chooseOperation('-'))}
                    
                    {renderButton('4', () => addDigit('4'))}
                    {renderButton('5', () => addDigit('5'))}
                    {renderButton('6', () => addDigit('6'))}
                    {renderButton('+', () => chooseOperation('+'))}

                    {renderButton('1', () => addDigit('1'))}
                    {renderButton('2', () => addDigit('2'))}
                    {renderButton('3', () => addDigit('3'))}
                    {renderButton('=', calculate, 'row-span-2 bg-primary/90 hover:bg-primary text-primary-foreground')}
                    
                    {renderButton('0', () => addDigit('0'), 'col-span-2')}
                    {renderButton('.', () => addDigit('.'))}
                </div>
            </CardContent>
        </Card>
    );
};

export default BasicCalculator;
