
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Last Updated: April 16, 2025
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Acceptance of Terms</h3>
          <p>
            By accessing or using our school management system, you agree to be bound by these 
            Terms and Conditions. If you do not agree to these terms, please do not use our platform.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">User Accounts</h3>
          <p>
            When you create an account on our platform, you are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing accurate and complete information</li>
            <li>Maintaining the security of your account and password</li>
            <li>All activities that occur under your account</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6">Acceptable Use</h3>
          <p>
            You agree to use our platform only for lawful purposes and in a way that does not 
            infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Data and Privacy</h3>
          <p>
            Your use of our platform is also governed by our Privacy Policy, which is incorporated 
            by reference into these Terms and Conditions.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Intellectual Property</h3>
          <p>
            The content on our platform, including text, graphics, logos, and software, is the 
            property of our company and is protected by copyright and other intellectual property laws.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or 
            revenues, whether incurred directly or indirectly.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Changes to These Terms</h3>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. We will notify 
            users of any significant changes by posting a notice on our platform.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Contact Us</h3>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at legal@school.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditions;
