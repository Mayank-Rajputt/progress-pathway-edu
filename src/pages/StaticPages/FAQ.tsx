
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // FAQ categories with questions and answers
  const faqCategories = [
    {
      id: 'account',
      title: 'Account Management',
      items: [
        {
          id: 'reset-password',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot password?" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password. Follow the link in the email to create a new password.'
        },
        {
          id: 'change-email',
          question: 'Can I change my email address?',
          answer: 'Yes. Go to "Profile" in your account settings. Click on "Edit Profile" and update your email address. You\'ll need to verify the new email address before the change takes effect.'
        },
        {
          id: 'delete-account',
          question: 'How do I delete my account?',
          answer: 'Account deletion must be handled by your institution\'s administrator. Please contact your school administrator or our support team for assistance with account deletion.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      items: [
        {
          id: 'browser-support',
          question: 'Which browsers are supported?',
          answer: 'Trakdemy works best with the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          id: 'mobile-support',
          question: 'Is there a mobile app?',
          answer: 'Yes, we offer mobile apps for both iOS and Android. You can download them from the Apple App Store or Google Play Store. The web application is also fully responsive for mobile browsers.'
        },
        {
          id: 'data-export',
          question: 'How can I export my data?',
          answer: 'Administrators and teachers can export data in various formats (CSV, Excel, PDF) from most data tables in the system. Look for the "Export" or "Download" button in the relevant sections.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing and Subscriptions',
      items: [
        {
          id: 'payment-methods',
          question: 'What payment methods do you accept?',
          answer: 'We accept credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual subscriptions. For educational institutions, we also offer purchase order options.'
        },
        {
          id: 'upgrade-plan',
          question: 'How do I upgrade my subscription plan?',
          answer: 'Administrators can upgrade the subscription plan by going to "Billing" in the admin dashboard. Select the new plan and follow the payment instructions. The new features will be available immediately upon successful payment.'
        },
        {
          id: 'cancel-subscription',
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your subscription at any time. Go to "Billing" in the admin dashboard and select "Cancel Subscription." Your access will continue until the end of the current billing period.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Privacy and Security',
      items: [
        {
          id: 'data-security',
          question: 'How is my data secured?',
          answer: 'We employ industry-standard security measures including encryption of all data in transit and at rest, regular security audits, and secure data centers. We comply with GDPR, FERPA, and other educational data privacy regulations.'
        },
        {
          id: 'report-security',
          question: 'What should I do if I see inappropriate content?',
          answer: 'If you encounter inappropriate content, please use the "Report Abuse" feature available in the footer of every page. You can also contact your institution\'s administrator or our support team directly.'
        },
        {
          id: 'privacy-policy',
          question: 'Where can I find your privacy policy?',
          answer: 'Our privacy policy is available in the footer of every page. It outlines how we collect, use, and protect your personal information. If you have specific privacy concerns, please contact our data protection officer at privacy@trakdemy.com.'
        }
      ]
    }
  ];
  
  // Filter FAQs based on search term
  const filteredFAQs = searchTerm
    ? faqCategories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : faqCategories;

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
          <p className="text-muted-foreground">
            Find answers to common questions about using Trakdemy
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search frequently asked questions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </Button>
              )}
            </div>
            
            {/* FAQs by category */}
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map(category => (
                category.items.length > 0 && (
                  <div key={category.id} className="pt-2">
                    <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map(item => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-1 text-muted-foreground">
                              {item.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No results found for "{searchTerm}"</p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            )}
            
            {/* Contact support */}
            <div className="bg-primary/5 rounded-lg p-6 mt-8 text-center">
              <h3 className="font-semibold text-lg mb-2">Couldn't find an answer?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help with any questions you may have.
              </p>
              <Button asChild>
                <a href="/support">Contact Support</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
