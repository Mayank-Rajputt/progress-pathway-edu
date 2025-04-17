
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ReportAbuse = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reportType: '',
    location: '',
    description: '',
    evidence: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, reportType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, evidence: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be connected to a real backend API in production
    console.log('Report submitted:', formData);
    toast.success('Your report has been submitted. Our team will review it shortly.');
    setFormData({
      name: '',
      email: '',
      reportType: '',
      location: '',
      description: '',
      evidence: null
    });
  };

  return (
    <div className="container py-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Report Abuse</CardTitle>
          <p className="text-muted-foreground">
            Help us maintain a safe and respectful environment by reporting inappropriate content or behavior.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    All reports are confidential and will be handled by our Trust & Safety team.
                    For urgent situations that require immediate attention, please contact your local authorities.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportType">Type of Issue</Label>
                <Select onValueChange={handleSelectChange} value={formData.reportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                    <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                    <SelectItem value="privacy_violation">Privacy Violation</SelectItem>
                    <SelectItem value="spam">Spam or Scam</SelectItem>
                    <SelectItem value="copyright">Copyright Infringement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Where did this occur?</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="E.g., User profile, Chat, Specific page URL"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Please provide as much detail as possible about the issue"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence (Optional)</Label>
                <Input
                  id="evidence"
                  name="evidence"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload screenshots, documents, or other evidence (Max size: 10MB)
                </p>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full sm:w-auto">
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportAbuse;
