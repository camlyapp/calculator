
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';

export default function AboutUs() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">About Camly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground prose prose-invert">
                <h2 className="text-xl font-semibold text-foreground pt-4">Our Mission</h2>
                <p>At Camly, our mission is to empower individuals to make smarter financial and life decisions by providing a comprehensive suite of accurate, easy-to-use, and accessible calculators. We believe that with the right tools, anyone can take control of their financial future, improve their health, and satisfy their intellectual curiosity.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">What We Offer</h2>
                <p>Camly is your one-stop destination for a wide range of calculators, including:</p>
                <ul>
                    <li><strong>Financial Calculators:</strong> From simple loan and mortgage calculators to complex investment, retirement, and tax planning tools.</li>
                    <li><strong>Health & Wellness:</strong> Track your fitness goals with BMI, BMR, and calorie calculators. Plan for important life events with our due date and ovulation predictors.</li>
                    <li><strong>Math & Science:</strong> Whether you're a student or a professional, our scientific, graphing, and unit conversion tools are here to help.</li>
                    <li><strong>Everyday Utilities:</strong> A variety of other useful tools for everyday needs.</li>
                </ul>

                 <h2 className="text-xl font-semibold text-foreground pt-4">Our Commitment</h2>
                <p>We are committed to providing a reliable, secure, and user-friendly platform. Your privacy is important to us, and we handle your data with the utmost care. Our calculators are regularly updated to ensure they reflect the latest standards and information.</p>

                <p>Thank you for choosing Camly. We're excited to be a part of your journey towards a more informed and empowered life.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
