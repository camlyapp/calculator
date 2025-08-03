
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Contact Us</CardTitle>
              <CardDescription>We'd love to hear from you. Reach out with any questions or feedback.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Mail className="h-6 w-6 text-primary" />
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <a href="mailto:contact@loansage.ai" className="text-muted-foreground hover:text-primary">contact@loansage.ai</a>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Phone className="h-6 w-6 text-primary" />
                            <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-muted-foreground">(555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">Send us a Message</h3>
                     <form className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                         <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Your Email Address" />
                        </div>
                         <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
