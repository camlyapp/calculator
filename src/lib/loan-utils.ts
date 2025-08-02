import type { AmortizationRow } from './types';

export const calculateMonthlyPayment = (principal: number, annualRate: number, termYears: number): number => {
  if (principal <= 0 || termYears <= 0) return 0;
  
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return payment;
};

export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termYears: number,
  extraPayment: number = 0
): { schedule: AmortizationRow[], monthlyPayment: number } => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  if (monthlyPayment <= 0) return { schedule: [], monthlyPayment: 0 };
  
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  let month = 1;

  while (balance > 0) {
    const interest = balance * monthlyRate;
    let principalPortion = monthlyPayment - interest;
    
    // Ensure principal portion is not negative in final payments
    if (principalPortion > balance) {
        principalPortion = balance;
    }
    
    let actualExtraPayment = 0;
    if (extraPayment > 0) {
        // Extra payment should not exceed the remaining balance
        actualExtraPayment = Math.min(extraPayment, balance - principalPortion);
    }

    const totalPayment = principalPortion + interest + actualExtraPayment;
    const principalPaid = principalPortion + actualExtraPayment;
    
    if (balance - principalPaid < 0.01) { // Handle floating point inaccuracies for the last payment
        schedule.push({
            month,
            interest,
            principal: balance,
            extraPayment: 0, // No extra payment on the final adjusted payment
            totalPayment: balance + interest,
            remainingBalance: 0,
        });
        balance = 0;
    } else {
        balance -= principalPaid;
        schedule.push({
            month,
            interest,
            principal: principalPaid,
            extraPayment: extraPayment, // show the intended extra payment for consistency
            totalPayment: totalPayment,
            remainingBalance: balance,
        });
    }
    month++;
  }

  return { schedule, monthlyPayment };
};

    