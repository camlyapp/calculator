
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OtherSpecializedCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Other Specialized Calculators</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">More specialized calculators will be added here soon.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
