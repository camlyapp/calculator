
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { evaluate } from 'math-expression-evaluator';

const ScientificCalculator = () => {
    const [expression, setExpression] = useState('0');
    const [result, setResult] = useState('');
    const [isSecondF, setIsSecondF] = useState(false);

    const handleInput = (value: string) => {
        if (expression === '0' && !'()'.includes(value) && value !== '.') {
            setExpression(value);
        } else if (result && !'+-*/^'.includes(value)) {
            // Start new calculation if a number is pressed after a result
            setExpression(value);
            setResult('');
        } else {
             // If there's a result, and an operator is pressed, continue calculation
            const newExpression = result ? result.substring(2) + value : expression + value;
            setExpression(newExpression);
            setResult('');
        }
    };
    
    const handleOperator = (op: string) => {
        setExpression(prev => prev + op);
        setResult('');
    };
    
    const handleFunction = (func: string) => {
        if (expression === '0') {
             setExpression(func + '(');
        } else {
            setExpression(prev => prev + func + '(');
        }
        setResult('');
    };

    const calculate = () => {
        try {
            // The library 'math-expression-evaluator' uses 'log' for log10 and 'ln' for natural log.
            // It supports factorial with '!'
            // Let's replace special characters before evaluation
            const exprToEval = expression
                .replace(/π/g, 'pi')
                .replace(/√/g, 'sqrt')
                .replace(/sin⁻¹/g, 'asin')
                .replace(/cos⁻¹/g, 'acos')
                .replace(/tan⁻¹/g, 'atan')
                .replace(/log₂/g, 'log2')
                .replace(/e\^/g, 'exp');

            const evalResult = evaluate(exprToEval);
            setResult(`= ${evalResult}`);
        } catch (error) {
            setResult('Error');
        }
    };

    const clear = () => {
        setExpression('0');
        setResult('');
    };

    const backspace = () => {
        if (result) {
            clear();
            return;
        }
        setExpression(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    };

     const handlePercentage = () => {
        try {
            const res = evaluate(expression) / 100;
            setExpression(res.toString());
        } catch (error) {
            setResult('Error');
        }
    };

    const handleReciprocal = () => {
        try {
            const res = 1 / evaluate(expression);
            setExpression(res.toString());
        } catch (error) {
            setResult('Error');
        }
    }
    
    const renderButton = (label: string, onClick: () => void, className: string = '', variant: "secondary" | "outline" | "default" | "destructive" | "ghost" | "link" | null | undefined = 'outline') => (
        <Button
            onClick={onClick}
            className={`text-md h-12 ${className}`}
            variant={variant || 'outline'}
        >
            {label}
        </Button>
    );

    return (
        <Card className="w-full max-w-md shadow-2xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl">Scientific Calculator</CardTitle>
                <CardDescription>Perform complex calculations with scientific functions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted rounded-lg p-4 text-right mb-4 overflow-x-auto">
                    <p className="text-3xl font-mono break-all h-10">{expression}</p>
                    <p className="text-2xl font-mono text-primary h-8">{result}</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {renderButton('2nd', () => setIsSecondF(!isSecondF), '', isSecondF ? 'default': 'outline')}
                    {renderButton('π', () => handleInput('π'))}
                    {renderButton('e', () => handleInput('e'))}
                    {renderButton('C', clear)}
                    {renderButton('DEL', backspace)}
                    
                    {renderButton(isSecondF ? 'x³' : 'x²', () => handleOperator(isSecondF ? '^3' : '^2'))}
                    {renderButton('1/x', handleReciprocal)}
                    {renderButton('(', () => handleInput('('))}
                    {renderButton(')', () => handleInput(')'))}
                    {renderButton('n!', () => handleOperator('!'))}
                    
                    {renderButton(isSecondF ? '³√' : '√', () => handleFunction(isSecondF ? 'cbrt' : '√'))}
                    {renderButton('7', () => handleInput('7'), '', 'secondary')}
                    {renderButton('8', () => handleInput('8'), '', 'secondary')}
                    {renderButton('9', () => handleInput('9'), '', 'secondary')}
                    {renderButton('÷', () => handleOperator('/'))}

                    {renderButton(isSecondF ? 'y√x' : 'xʸ', () => handleOperator(isSecondF ? 'nthRoot' : '^'))}
                    {renderButton('4', () => handleInput('4'), '', 'secondary')}
                    {renderButton('5', () => handleInput('5'), '', 'secondary')}
                    {renderButton('6', () => handleInput('6'), '', 'secondary')}
                    {renderButton('*', () => handleOperator('*'))}

                    {renderButton(isSecondF ? 'sin⁻¹' : 'sin', () => handleFunction(isSecondF ? 'sin⁻¹' : 'sin'))}
                    {renderButton('1', () => handleInput('1'), '', 'secondary')}
                    {renderButton('2', () => handleInput('2'), '', 'secondary')}
                    {renderButton('3', () => handleInput('3'), '', 'secondary')}
                    {renderButton('-', () => handleOperator('-'))}
                    
                    {renderButton(isSecondF ? 'cos⁻¹' : 'cos', () => handleFunction(isSecondF ? 'cos⁻¹' : 'cos'))}
                    {renderButton('0', () => handleInput('0'), '', 'secondary')}
                    {renderButton('.', () => handleInput('.'))}
                    {renderButton('=', calculate, 'bg-primary/90 hover:bg-primary text-primary-foreground')}
                    {renderButton('+', () => handleOperator('+'))}
                    
                    {renderButton(isSecondF ? 'tan⁻¹' : 'tan', () => handleFunction(isSecondF ? 'tan⁻¹' : 'tan'))}
                    {renderButton(isSecondF ? 'eˣ' : 'ln', () => handleFunction(isSecondF ? 'e^' : 'ln'))}
                    {renderButton(isSecondF ? 'log₂' : 'log', () => handleFunction(isSecondF ? 'log₂' : 'log'))}
                    {renderButton('%', handlePercentage)}
                </div>
            </CardContent>
        </Card>
    );
};

export default ScientificCalculator;
