
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';

export default function PrivacyPolicy() {
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
              <CardTitle className="text-3xl">Privacy Policy for Camly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose prose-invert">
                <p><strong>Last Updated: {lastUpdated}</strong></p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">Introduction</h2>
                <p>Welcome to Camly ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. By using our service, you agree to the collection and use of information in accordance with this policy.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                <ul>
                    <li><strong>Financial Data:</strong> Information that you provide when using our financial calculators, such as loan amounts, interest rates, income, and expenses. This data is processed on your device or sent to our AI services for processing and is not stored on our servers.</li>
                    <li><strong>Usage Data:</strong> We may automatically collect standard log information and device information when you access our app.</li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground pt-4">Use of Your Information</h2>
                <p>Having accurate information permits us to offer you a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
                <ul>
                    <li>Provide and maintain our service.</li>
                    <li>Power our AI-driven features to give you personalized financial suggestions.</li>
                    <li>Monitor the usage of our service to identify and prevent technical issues.</li>
                    <li>Anonymously analyze data to improve the application.</li>
                </ul>

                 <h2 className="text-xl font-semibold text-foreground pt-4">Data Security</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at: contact@loansage.ai</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
