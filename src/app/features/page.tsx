
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { Landmark, HeartPulse, BrainCircuit, Lightbulb, UserCheck, Calculator } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';

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
    },
    {
        icon: <Calculator className="h-8 w-8 text-primary" />,
        title: "Extensive Calculator Library",
        description: "Access a wide array of specialized tools for everyday needs, including date & time calculations, unit conversions, GPA, and even a carbon footprint estimator. All in one place."
    }
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
                    <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Powerful Features for Every Need
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl lg:mx-0">
                                Discover the tools and intelligence that make Camly the ultimate calculator suite for finance, health, science, and everyday life.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                         <Image 
                            src={placeholderImages.features_hero.src}
                            alt={placeholderImages.features_hero.alt}
                            width={550}
                            height={550}
                            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                            data-ai-hint={placeholderImages.features_hero['data-ai-hint']}
                        />
                    </div>
                </div>
            </div>
        </section>

        <section className="py-12 md:py-20 bg-muted/40">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                         <Card key={index} className="bg-background hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardHeader className="flex-row items-start gap-4 space-y-0">
                                <div className="p-3 bg-secondary rounded-full">
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      </main>
    </>
  );
}
