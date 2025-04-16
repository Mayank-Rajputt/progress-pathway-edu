
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Last Updated: April 16, 2025
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Introduction</h3>
          <p>
            This Privacy Policy describes how we collect, use, and share your personal information
            when you use our school management system.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Information We Collect</h3>
          <p>
            We collect several types of information from and about users of our platform, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information such as name, email address, and contact details</li>
            <li>Academic information for students</li>
            <li>Attendance records</li>
            <li>User preferences and settings</li>
            <li>Log data and usage information</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6">How We Use Your Information</h3>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and maintaining our platform</li>
            <li>Tracking attendance and academic performance</li>
            <li>Facilitating communication between users</li>
            <li>Improving our services</li>
            <li>Complying with legal obligations</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6">Data Security</h3>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 
            100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@school.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
