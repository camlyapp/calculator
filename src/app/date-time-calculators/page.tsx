
import Header from '@/components/header';
import DateCalculator from '@/components/date-calculator';

export default function DateTimeCalculators() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto">
            <DateCalculator />
        </div>
      </main>
    </>
  );
}
