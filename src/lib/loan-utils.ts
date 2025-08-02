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
    
    // Total payment for the month including extra
    const totalMonthlyWithExtra = monthlyPayment + extraPayment;

    // The amount applied to principal is the monthly payment's principal portion plus the extra payment
    let principalPaid = principalPortion + extraPayment;

    // Check if the remaining balance is less than the total payment
    if (balance < totalMonthlyWithExtra - interest) {
        principalPaid = balance;
        const finalPayment = balance + interest;
        schedule.push({
            month,
            interest,
            principal: principalPaid,
            extraPayment: 0,
            totalPayment: finalPayment,
            remainingBalance: 0,
        });
        balance = 0;
    } else {
        balance -= principalPaid;
        schedule.push({
            month,
            interest,
            principal: principalPaid,
            extraPayment,
            totalPayment: totalMonthlyWithExtra,
            remainingBalance: balance,
        });
    }
    month++;
  }

  return { schedule, monthlyPayment };
};