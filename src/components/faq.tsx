
"use client";

import { useEffect, useState } from "react";
import { generateFaqAction } from "@/app/actions";
import type { GenerateFaqOutput } from "@/ai/flows/generate-faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface FaqProps {
    calculatorName: string;
}

const Faq = ({ calculatorName }: FaqProps) => {
    const [faqData, setFaqData] = useState<GenerateFaqOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await generateFaqAction(calculatorName);
                if (response.faqs) {
                    setFaqData(response.faqs);
                } else if (response.error) {
                    setError(response.error);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching FAQs.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, [calculatorName]);

    if (isLoading) {
        return (
            <Card className="mt-8">
                <CardHeader>
                     <Skeleton className="h-8 w-1/2" />
                     <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }
    
    if (error) {
         return (
             <Alert variant="destructive" className="mt-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!faqData || faqData.faqs.length === 0) {
        return null;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                    Get answers to common questions about the {calculatorName}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {faqData.faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert">
                                <p>{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default Faq;
