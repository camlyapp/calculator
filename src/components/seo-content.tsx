
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const SeoContent = () => {
  return (
    <section className="bg-card/50 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-foreground">
              Your All-in-One Financial and Lifestyle Calculator Suite
            </CardTitle>
             <CardDescription className="text-center max-w-3xl mx-auto pt-2">
                Camly provides a comprehensive collection of free, easy-to-use calculators to help you make informed decisions. From financial planning and investment tracking to health metrics and scientific equations, our tools are designed for accuracy and simplicity.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">Financial Calculators</h3>
                <p className="text-sm text-muted-foreground">
                    Master your finances with our extensive suite of tools. Calculate your EMI for personal loans with our versatile Loan Calculator, plan your home purchase with the Mortgage Calculator, and compare different loan options side-by-side. Project your wealth with the Investment and Compound Interest calculators, and secure your future with the Retirement and Savings Goal planners. We also offer specialized tools for Indian users like SIP, PPF, and Gratuity calculators, alongside universal Tax, GST, and Budget calculators to give you a complete financial picture.
                </p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">Math & Science Tools</h3>
                <p className="text-sm text-muted-foreground">
                    Whether you're a student or a professional, our math and science calculators have you covered. Perform basic arithmetic, solve complex equations with the Scientific Calculator, and visualize functions with our Graphing Calculator. We also provide specialized tools for fractions, percentages, algebra (linear, quadratic), geometry (area, perimeter), physics (speed, force), and chemistry (molarity, molecular weight) to help you with your academic or professional needs.
                </p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">Health & Lifestyle Planners</h3>
                <p className="text-sm text-muted-foreground">
                    Take control of your well-being with our health and lifestyle calculators. Track your fitness with the BMI, BMR, and Body Fat calculators. Plan for your family with the Due Date and Ovulation predictors. Monitor your fitness journey with our Calorie and Heart Rate tools. Plus, explore a variety of other calculators for daily life, including Age, Workdays, GPA, Fuel Efficiency and even a Carbon Footprint estimator.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SeoContent;
