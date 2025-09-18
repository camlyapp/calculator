
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { Landmark, HeartPulse, BrainCircuit, Lightbulb, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features - Camly | Financial, Health, & AI Calculators',
  description: 'Explore the powerful features of Camly, including a comprehensive suite of financial calculators, health and wellness trackers, advanced math and science tools, and AI-powered suggestions to optimize your decisions.',
  keywords: ['financial calculators', 'health calculators', 'ai financial advisor', 'math tools', 'emi calculator', 'mortgage calculator', 'investment calculator', 'bmi calculator', 'due date calculator', 'scientific calculator'],
};

const features = [
    {
        icon: <Landmark className="h-8 w-8 text-primary" />,
        title: "Comprehensive Financial Suite",
        description: "From EMI, mortgage, and loan comparisons to detailed investment, retirement, and tax planning, our tools provide clarity for every financial decision. Specialized calculators for SIP, PPF, and Gratuity are also included."
    },
    {
        icon: <HeartPulse className="h-8 w-8 text-primary" />,
        title: "Health & Wellness Tracking",
        description: "Monitor your health with our BMI, BMR, and Body Fat calculators. Plan for life's biggest moments with our Due Date and Ovulation predictors. Stay on top of your fitness goals with calorie and heart rate monitors."
    },
     {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "Advanced Math & Science Tools",
        description: "Solve everything from basic arithmetic to complex equations. Our suite includes a Scientific Calculator, Graphing Calculator, and specialized tools for algebra, geometry, physics, and chemistry."
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: "AI-Powered Smart Suggestions",
        description: "Go beyond numbers. Our AI-powered features analyze your financial situation to provide personalized, actionable suggestions for loan optimization, refinancing, and achieving your financial goals faster."
    },
    {
        icon: <UserCheck className="h-8 w-8 text-primary" />,
        title: "User-Friendly and Accessible",
        description: "Enjoy a seamless experience with an intuitive interface, mobile-friendly design, and the ability to download or share your results as PDF or image files. Your data is processed securely and is never stored."
    }
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Card className="bg-card/50">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Camly Features
              </CardTitle>
              <p className="text-muted-foreground md:text-xl max-w-3xl mx-auto pt-2">
                Discover the tools and intelligence that make Camly the ultimate calculator suite for finance, health, and more.
              </p>
            </CardHeader>
            <CardContent className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                         <Card key={index} className="bg-background/70 hover:shadow-lg transition-shadow">
                            <CardHeader className="flex-row items-center gap-4">
                                {feature.icon}
                                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
