
import Header from '@/components/header';
import BasicCalculator from '@/components/basic-calculator';

export default function MathScienceCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <BasicCalculator />
      </main>
    </>
  );
}
