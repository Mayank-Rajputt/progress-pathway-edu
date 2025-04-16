
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to the school management system. Our platform is designed to provide 
            a comprehensive solution for schools to manage their administrative tasks, 
            student records, attendance, and academic performance.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Our Mission</h3>
          <p>
            Our mission is to simplify the management of educational institutions by providing 
            intuitive and effective tools that streamline administrative tasks and enhance 
            communication between teachers, students, and parents.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comprehensive student management</li>
            <li>Attendance tracking for students and teachers</li>
            <li>Academic performance monitoring and reporting</li>
            <li>Communication tools for teachers, students, and parents</li>
            <li>Role-based access control</li>
            <li>Customizable dashboard for different user roles</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6">Contact Us</h3>
          <p>
            If you have any questions or feedback about our platform, please don't 
            hesitate to contact our support team at support@school.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
