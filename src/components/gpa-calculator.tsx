
"use client";

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';

const gradePoints: { [key: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const courseSchema = z.object({
  name: z.string().optional(),
  grade: z.string().min(1, "Grade is required."),
  credits: z.coerce.number().min(0, "Credits must be a positive number."),
});

const gpaSchema = z.object({
  courses: z.array(courseSchema),
});

type GpaFormValues = z.infer<typeof gpaSchema>;
type Course = z.infer<typeof courseSchema>;

const GpaCalculator = () => {
  const [gpaResult, setGpaResult] = useState<{ gpa: number; totalCredits: number } | null>(null);

  const form = useForm<GpaFormValues>({
    resolver: zodResolver(gpaSchema),
    defaultValues: {
      courses: [
        { name: 'Example: Biology 101', grade: 'A-', credits: 3 },
        { name: 'Example: History 205', grade: 'B+', credits: 3 },
        { name: 'Example: Math 300', grade: 'A', credits: 4 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courses',
  });

  const onSubmit = (data: GpaFormValues) => {
    let totalPoints = 0;
    let totalCredits = 0;

    data.courses.forEach((course: Course) => {
      const points = gradePoints[course.grade];
      if (points !== undefined && course.credits > 0) {
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    if (totalCredits === 0) {
      setGpaResult({ gpa: 0, totalCredits: 0 });
    } else {
      setGpaResult({ gpa: totalPoints / totalCredits, totalCredits });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">GPA Calculator</CardTitle>
        <CardDescription>
          Calculate your Grade Point Average by adding your courses and grades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`courses.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Course Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Chemistry 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`courses.${index}.grade`}
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-32">
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(gradePoints).map(grade => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`courses.${index}.credits`}
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-32">
                        <FormLabel>Credits/Hours</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
                 <Button type="button" variant="outline" onClick={() => append({ name: '', grade: 'A', credits: 3 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Course
                </Button>
                <Button type="submit" size="lg">Calculate GPA</Button>
            </div>
           
          </form>
        </Form>

        {gpaResult && (
          <div className="mt-8 pt-8">
             <Separator />
            <div className="mt-8 text-center bg-secondary/50 p-6 rounded-lg">
                <Label className="text-lg text-muted-foreground">Your Calculated GPA</Label>
                <p className="text-5xl font-bold text-primary">{gpaResult.gpa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Based on {gpaResult.totalCredits} total credits.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GpaCalculator;
