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
    const scheduledPrincipal = monthlyPayment - interest;
    
    const actualExtraPayment = Math.min(balance - scheduledPrincipal, extraPayment);
    const principalPaid = scheduledPrincipal + actualExtraPayment;
    const totalPayment = monthlyPayment + actualExtraPayment;
    
    if (principalPaid > balance) {
        const finalPrincipal = balance;
        const finalTotalPayment = interest + finalPrincipal;
        schedule.push({
            month,
            interest: interest > 0 ? interest: 0,
            principal: finalPrincipal,
            extraPayment: 0,
            totalPayment: finalTotalPayment,
            remainingBalance: 0,
        });
        balance = 0;
    } else {
        balance -= principalPaid;
        schedule.push({
            month,
            interest: interest > 0 ? interest: 0,
            principal: principalPaid,
            extraPayment: actualExtraPayment,
            totalPayment: totalPayment,
            remainingBalance: balance,
        });
    }
    month++;
  }

  return { schedule, monthlyPayment };
};
