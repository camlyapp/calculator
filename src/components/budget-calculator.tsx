
"use client";

import { useState, useMemo, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Separator } from './ui/separator';
import DownloadResults from './download-results';
import { useCurrency } from '@/context/currency-context';

const itemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().min(0, "Amount must be positive."),
  category: z.string().optional(),
});

const budgetSchema = z.object({
  incomes: z.array(itemSchema),
  expenses: z.array(itemSchema.extend({
      category: z.string().min(1, "Category is required."),
  })),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const expenseCategories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Other'];

const chartConfig = {
    Housing: { label: "Housing", color: "hsl(var(--chart-1))" },
    Food: { label: "Food", color: "hsl(var(--chart-2))" },
    Transportation: { label: "Transportation", color: "hsl(var(--chart-3))" },
    Utilities: { label: "Utilities", color: "hsl(var(--chart-4))" },
    Entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
    Health: { label: "Health", color: "hsl(var(--primary))" },
    Other: { label: "Other", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

const BudgetCalculator = () => {
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      incomes: [{ description: 'Monthly Salary', amount: 5000 }],
      expenses: [
        { description: 'Rent', category: 'Housing', amount: 1500 },
        { description: 'Groceries', category: 'Food', amount: 400 },
      ],
    },
  });

  const { fields: incomeFields, append: appendIncome, remove: removeIncome } = useFieldArray({
    control: form.control,
    name: 'incomes',
  });

  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
    control: form.control,
    name: 'expenses',
  });
  
  const watchedValues = form.watch();

  const { totalIncome, totalExpenses, netBalance, expenseByCategory } = useMemo(() => {
    const totalIncome = watchedValues.incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = watchedValues.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    const expenseByCategory = watchedValues.expenses.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += expense.amount;
        return acc;
    }, {} as {[key: string]: number});

    return { totalIncome, totalExpenses, netBalance, expenseByCategory };
  }, [watchedValues]);

  const pieChartData = useMemo(() => {
    return Object.entries(expenseByCategory).map(([name, value]) => ({ name, value, fill: `var(--color-${name})` }));
  }, [expenseByCategory]);

  const onSubmit = () => {
    setShowResults(true);
  }

  return (
    <Card className="w-full mt-6 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="text-2xl">Budget Calculator</CardTitle>
                <CardDescription>
                Manage your monthly income and expenses to understand your cash flow.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Income Section */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Income</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => appendIncome({ description: '', amount: 0 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Income
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 items-start p-2 border rounded-lg">
                      <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`incomes.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`incomes.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" placeholder="Amount" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeIncome(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Expenses Section */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Expenses</span>
                     <Button type="button" size="sm" variant="ghost" onClick={() => appendExpense({ description: '', amount: 0, category: 'Other' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseFields.map((field, index) => (
                     <div key={field.id} className="grid grid-cols-2 sm:grid-cols-[auto_1fr_auto_auto] gap-2 items-start p-2 border rounded-lg">
                        <FormField
                          control={form.control}
                          name={`expenses.${index}.category`}
                          render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                              <select {...field} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                  {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                          <FormField
                          control={form.control}
                          name={`expenses.${index}.description`}
                          render={({ field }) => (
                              <FormItem>
                              <FormControl>
                                  <Input placeholder="Description" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                          <FormField
                          control={form.control}
                          name={`expenses.${index}.amount`}
                          render={({ field }) => (
                              <FormItem>
                              <FormControl>
                                  <Input type="number" placeholder="Amount" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                       <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeExpense(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Calculate Budget</Button>
            
             {showResults && (
              <>
                <Separator />
                <div ref={resultsRef} className="space-y-8 pt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                      <Card className="lg:col-span-2 bg-secondary/50">
                          <CardHeader>
                              <CardTitle>Budget Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 text-center">
                            <div>
                                  <p className="text-muted-foreground">Total Income</p>
                                  <p className="text-2xl font-bold text-accent">{formatCurrency(totalIncome)}</p>
                              </div>
                              <div>
                                  <p className="text-muted-foreground">Total Expenses</p>
                                  <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                              </div>
                              <div>
                                  <p className="text-muted-foreground">Net Balance</p>
                                  <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                      {formatCurrency(netBalance)}
                                  </p>
                              </div>
                          </CardContent>
                      </Card>
                      <Card className="lg:col-span-3">
                          <CardHeader>
                              <CardTitle>Expense Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px] w-full">
                                <ChartContainer config={chartConfig}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label>
                                                {pieChartData.map((entry) => (
                                                    <Cell key={`cell-${entry.name}`} fill={entry.fill as string} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                  </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                          </CardContent>
                      </Card>
                  </div>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
      {showResults && (
        <CardFooter>
            <DownloadResults
                fileName="budget_analysis"
                resultsRef={resultsRef}
            />
        </CardFooter>
       )}
    </Card>
  );
};

export default BudgetCalculator;
