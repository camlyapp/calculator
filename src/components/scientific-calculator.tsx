
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { evaluate } from 'math-expression-evaluator';

const ScientificCalculator = () => {
    const [expression, setExpression] = useState('0');
    const [result, setResult] = useState('');

    const handleInput = (value: string) => {
        if (expression === '0' && !'()'.includes(value)) {
            setExpression(value);
        } else if (result) {
            setExpression(value);
            setResult('');
        } else {
            setExpression(prev => prev + value);
        }
    };
    
    const handleOperator = (op: string) => {
        setExpression(prev => prev + op);
        setResult('');
    };
    
    const handleFunction = (func: string) => {
        setExpression(prev => prev + func + '(');
        setResult('');
    };

    const calculate = () => {
        try {
            // The library expects 'log' as log10, but JS Math.log is ln.
            // A simple replace is not enough. We'll let the library handle it.
            // It correctly interprets log as log10 and ln as natural log.
            const evalResult = evaluate(expression.replace(/π/g, 'pi').replace(/√/g, 'sqrt'));
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
    
    const renderButton = (label: string, onClick: () => void, className: string = '') => (
        <Button
            onClick={onClick}
            className={`text-lg h-12 ${className}`}
            variant={['+', '-', '*', '/', '='].includes(label) ? 'secondary' : 'outline'}
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
                    {renderButton('sin', () => handleFunction('sin'))}
                    {renderButton('cos', () => handleFunction('cos'))}
                    {renderButton('tan', () => handleFunction('tan'))}
                    {renderButton('log', () => handleFunction('log'))}
                    {renderButton('ln', () => handleFunction('ln'))}
                    
                    {renderButton('(', () => handleInput('('))}
                    {renderButton(')', () => handleInput(')'))}
                    {renderButton('x²', () => handleOperator('^2'))}
                    {renderButton('√', () => handleOperator('√'))}
                    {renderButton('^', () => handleOperator('^'))}
                    
                    {renderButton('7', () => handleInput('7'))}
                    {renderButton('8', () => handleInput('8'))}
                    {renderButton('9', () => handleInput('9'))}
                    {renderButton('DEL', backspace, 'bg-destructive/80 hover:bg-destructive text-destructive-foreground')}
                    {renderButton('AC', clear, 'bg-destructive/80 hover:bg-destructive text-destructive-foreground')}

                    {renderButton('4', () => handleInput('4'))}
                    {renderButton('5', () => handleInput('5'))}
                    {renderButton('6', () => handleInput('6'))}
                    {renderButton('*', () => handleOperator('*'))}
                    {renderButton('/', () => handleOperator('/'))}

                    {renderButton('1', () => handleInput('1'))}
                    {renderButton('2', () => handleInput('2'))}
                    {renderButton('3', () => handleInput('3'))}
                    {renderButton('+', () => handleOperator('+'))}
                    {renderButton('-', () => handleOperator('-'))}
                    
                    {renderButton('0', () => handleInput('0'))}
                    {renderButton('.', () => handleInput('.'))}
                    {renderButton('π', () => handleInput('π'))}
                    {renderButton('e', () => handleInput('e'))}
                    {renderButton('=', calculate, 'bg-primary/90 hover:bg-primary text-primary-foreground')}
                </div>
            </CardContent>
        </Card>
    );
};

export default ScientificCalculator;
