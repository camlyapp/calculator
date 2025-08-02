
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DateTimeCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Date & Time Calculators</CardTitle>
                    <CardDescription>
                        A suite of tools for all your date and time calculation needs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        New calculators are coming soon, including an Age Calculator, Date Duration Calculator, and more!
                    </p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
