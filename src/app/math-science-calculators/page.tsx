
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/header';
import { Construction } from 'lucide-react';

export default function MathScienceCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Construction className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl mt-4">Coming Soon!</CardTitle>
                <CardDescription className="text-lg">
                    We are hard at work building a new suite of Math &amp; Science calculators.
                    Check back soon for tools to help with algebra, geometry, physics, and more!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Thank you for your patience.</p>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
