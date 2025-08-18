
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Landmark, BrainCircuit, HeartPulse } from 'lucide-react';

const seoSections = [
    {
        icon: <Landmark className="h-8 w-8 text-primary" />,
        title: "Financial Calculators",
        description: "Master your finances with our extensive suite of tools. Calculate your EMI for personal loans with our versatile Loan Calculator, plan your home purchase with the Mortgage Calculator, and compare different loan options side-by-side. Project your wealth with the Investment and Compound Interest calculators, and secure your future with the Retirement and Savings Goal planners. We also offer specialized tools for Indian users like SIP, PPF, and Gratuity calculators, alongside universal Tax, GST, and Budget calculators to give you a complete financial picture."
    },
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "Math & Science Tools",
        description: "Whether you're a student or a professional, our math and science calculators have you covered. Perform basic arithmetic, solve complex equations with the Scientific Calculator, and visualize functions with our Graphing Calculator. We also provide specialized tools for fractions, percentages, algebra (linear, quadratic), geometry (area, perimeter), physics (speed, force), and chemistry (molarity, molecular weight) to help you with your academic or professional needs."
    },
    {
        icon: <HeartPulse className="h-8 w-8 text-primary" />,
        title: "Health & Lifestyle Planners",
        description: "Take control of your well-being with our health and lifestyle calculators. Track your fitness with the BMI, BMR, and Body Fat calculators. Plan for your family with the Due Date and Ovulation predictors. Monitor your fitness journey with our Calorie and Heart Rate tools. Plus, explore a variety of other calculators for daily life, including Age, Workdays, GPA, Fuel Efficiency and even a Carbon Footprint estimator."
    }
]

const SeoContent = () => {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your All-in-One Financial and Lifestyle Calculator Suite
            </h2>
             <p className="text-muted-foreground text-lg mt-4 max-w-3xl mx-auto">
                Camly provides a comprehensive collection of free, easy-to-use calculators to help you make informed decisions. From financial planning and investment tracking to health metrics and scientific equations, our tools are designed for accuracy and simplicity.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seoSections.map((section, index) => (
                <Card key={index} className="bg-card hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                           {section.icon}
                        </div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SeoContent;
