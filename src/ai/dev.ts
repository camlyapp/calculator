import {config} from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  config();
}

import '@/ai/flows/suggest-loan-optimizations.ts';
import '@/ai/flows/analyze-refinance.ts';
import '@/ai/flows/convert-currency.ts';
import '@/ai/flows/calculate-indian-tax.ts';
import '@/ai/flows/check-loan-eligibility.ts';
import '@/ai/flows/calculate-gratuity.ts';
import '@/ai/flows/get-pregnancy-advice.ts';
import '@/ai/flows/ask-pregnancy-question.ts';
import '@/ai/flows/solve-chemistry-problem.ts';
import '@/ai/flows/generate-faq.ts';
