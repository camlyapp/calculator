
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { evaluate } from 'math-expression-evaluator';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from './ui/chart';

const graphingSchema = z.object({
  expression: z.string().min(1, "Function is required."),
  xMin: z.coerce.number(),
  xMax: z.coerce.number(),
  step: z.coerce.number().min(0.01, "Step must be at least 0.01."),
}).refine(data => data.xMax > data.xMin, {
    message: "X Max must be greater than X Min.",
    path: ["xMax"],
});

type GraphingFormValues = z.infer<typeof graphingSchema>;
type PlotData = { x: number; y: number | null }[];

const chartConfig = {
  y: {
    label: "y",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const GraphingCalculator = () => {
  const [plotData, setPlotData] = useState<PlotData>([]);

  const form = useForm<GraphingFormValues>({
    resolver: zodResolver(graphingSchema),
    defaultValues: {
      expression: 'x^2',
      xMin: -10,
      xMax: 10,
      step: 0.5,
    },
  });

  const onSubmit = (values: GraphingFormValues) => {
    const { expression, xMin, xMax, step } = values;
    const data: PlotData = [];

    for (let x = xMin; x <= xMax; x += step) {
      try {
        // Replace 'x' with the current value, ensuring it's properly handled in expressions
        const exprWithVal = expression.replace(/x/g, `(${x})`);
        const y = evaluate(exprWithVal.replace(/π/g, 'pi').replace(/√/g, 'sqrt'));
        data.push({ x: parseFloat(x.toFixed(2)), y });
      } catch (error) {
        // If there's an error (e.g., division by zero), plot a gap
        data.push({ x: parseFloat(x.toFixed(2)), y: null });
      }
    }
    setPlotData(data);
  };

  return (
    <Card className="w-full shadow-2xl mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Graphing Calculator</CardTitle>
        <CardDescription>Plot mathematical functions on an interactive graph.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                 <FormField
                    control={form.control}
                    name="expression"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Function y = f(x)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., x^3 - 2*x" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="xMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X Min</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="xMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X Max</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="md:col-span-4">
                 <Button type="submit" className="w-full">Plot Function</Button>
               </div>
            </div>
          </form>
        </Form>

        {plotData.length > 0 && (
          <div className="mt-8 pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Graph of y = {form.getValues('expression')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                       <ChartContainer config={chartConfig}>
                          <ResponsiveContainer>
                          <LineChart data={plotData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                  dataKey="x" 
                                  type="number"
                                  domain={['dataMin', 'dataMax']}
                                  allowDecimals={false}
                                  label={{ value: 'x-axis', position: 'insideBottom', offset: -5 }}
                              />
                              <YAxis 
                                  domain={['auto', 'auto']}
                                  allowDecimals={false}
                                  label={{ value: 'y-axis', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip 
                                  content={<ChartTooltipContent />}
                                  formatter={(value, name) => [value, name === 'y' ? `y = ${form.getValues('expression')}` : name]}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" dot={false} connectNulls />
                          </LineChart>
                          </ResponsiveContainer>
                       </ChartContainer>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphingCalculator;
