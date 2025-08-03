
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';

export default function TermsOfService() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose prose-invert">
                <p><strong>Last Updated: {lastUpdated}</strong></p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
                <p>By accessing and using Camly ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. Description of Service</h2>
                <p>The Service provides a collection of calculator tools for informational purposes only. The information provided is not intended to be a substitute for professional financial, medical, or legal advice. You agree that your use of the Service is at your sole risk.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. User Conduct</h2>
                <p>You agree not to use the Service for any unlawful purpose or in any way that might harm, damage, or disparage any other party. You are responsible for all data you input into the calculators.</p>

                 <h2 className="text-xl font-semibold text-foreground pt-4">4. Disclaimer of Warranties</h2>
                <p>The Service is provided on an "as is" and "as available" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no warranty that the service will meet your requirements or be uninterrupted, timely, secure, or error-free.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">5. Limitation of Liability</h2>
                <p>You expressly understand and agree that we shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">6. Changes to the Terms</h2>
                <p>We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review this page periodically. Your continued use of the Website or our service after any such change constitutes your acceptance of the new Terms.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
