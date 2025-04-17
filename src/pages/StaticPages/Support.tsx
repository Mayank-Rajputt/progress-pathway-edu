
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { MailOpen, MessageCircleQuestion, Headphones, Clock } from 'lucide-react';

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    issue: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support request submitted:', contactForm);
    toast.success('Your message has been sent! Our support team will contact you soon.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      issue: '',
      message: ''
    });
  };

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Support Center</CardTitle>
          <p className="text-muted-foreground">
            Get help with your Trakdemy experience
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="contact">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
              <TabsTrigger value="self-help">Self Help</TabsTrigger>
              <TabsTrigger value="hours">Support Hours</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                  <MailOpen className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    support@trakdemy.com
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                  <Headphones className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Phone Support</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    +1 (800) 555-1234
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                  <MessageCircleQuestion className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Available 9 AM - 5 PM EST
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={(value) => handleSelectChange('subject', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="technical">Technical Problem</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue">Issue Priority</Label>
                      <Select onValueChange={(value) => handleSelectChange('issue', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General Question</SelectItem>
                          <SelectItem value="medium">Medium - Minor Issue</SelectItem>
                          <SelectItem value="high">High - System Unavailable</SelectItem>
                          <SelectItem value="critical">Critical - Data Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Button type="submit">Send Message</Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="self-help" className="pt-4">
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Helpful Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/faq" className="text-primary hover:underline flex items-center">
                        <span className="mr-2">•</span>
                        Frequently Asked Questions
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <span className="mr-2">•</span>
                        Video Tutorials
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <span className="mr-2">•</span>
                        User Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <span className="mr-2">•</span>
                        Knowledge Base
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline flex items-center">
                        <span className="mr-2">•</span>
                        Community Forum
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Common Issues</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">How to reset your password</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Click on the "Forgot password?" link on the login page and follow the instructions 
                        sent to your email address.
                      </p>
                      <a href="#" className="text-primary text-sm hover:underline">
                        View detailed steps →
                      </a>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Updating your profile information</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Navigate to your profile page by clicking on your avatar in the top right corner, 
                        then select "Edit Profile".
                      </p>
                      <a href="#" className="text-primary text-sm hover:underline">
                        View detailed steps →
                      </a>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Downloading report cards</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Go to the Report Cards section, select the desired report, and click the 
                        "Download PDF" button.
                      </p>
                      <a href="#" className="text-primary text-sm hover:underline">
                        View detailed steps →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hours" className="pt-4">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Support Operating Hours</h3>
                    <p className="text-muted-foreground">
                      Our team is available to assist you during the following hours:
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Day</th>
                        <th className="px-4 py-3 text-left font-medium">Email Support</th>
                        <th className="px-4 py-3 text-left font-medium">Phone Support</th>
                        <th className="px-4 py-3 text-left font-medium">Live Chat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-3">Monday - Friday</td>
                        <td className="px-4 py-3">24/7</td>
                        <td className="px-4 py-3">9 AM - 6 PM EST</td>
                        <td className="px-4 py-3">9 AM - 5 PM EST</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Saturday</td>
                        <td className="px-4 py-3">24/7</td>
                        <td className="px-4 py-3">10 AM - 4 PM EST</td>
                        <td className="px-4 py-3">Unavailable</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Sunday</td>
                        <td className="px-4 py-3">24/7</td>
                        <td className="px-4 py-3">Unavailable</td>
                        <td className="px-4 py-3">Unavailable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> During holidays and weekends, response times may be longer. 
                        For urgent issues outside of regular hours, please use our 24/7 email support.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">Special Support Hours for Educational Institutions</h3>
                  <p className="text-muted-foreground mb-4">
                    We offer extended support hours for schools during critical periods:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      <span>Beginning of Academic Year (August-September)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      <span>End of Semester Reporting (December and May)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      <span>System Upgrades and Migrations (As Scheduled)</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm">
                    Contact your account manager for details on extended support during these periods.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
