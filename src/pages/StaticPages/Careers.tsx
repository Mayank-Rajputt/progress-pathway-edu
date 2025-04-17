
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Careers = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    resume: null as File | null,
    coverLetter: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be connected to a real backend API in production
    console.log('Application submitted:', formData);
    toast.success('Your application has been submitted! We will contact you soon.');
    setIsFormOpen(false);
    setFormData({
      name: '',
      email: '',
      position: '',
      resume: null,
      coverLetter: ''
    });
  };

  // Sample open positions
  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      department: "Design",
      location: "Hybrid",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Educational Content Specialist",
      department: "Product",
      location: "Remote",
      type: "Contract"
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Service",
      location: "In-office",
      type: "Full-time"
    }
  ];

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Join Our Team</CardTitle>
          <p className="text-muted-foreground">
            Help us transform education with innovative technology
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Why Work at Trakdemy?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Meaningful Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Build technology that improves education for students, teachers, and parents worldwide.
                  </p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Growth & Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Continuous opportunities for professional development and skill advancement.
                  </p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Great Culture</h4>
                  <p className="text-sm text-muted-foreground">
                    Collaborative, flexible environment with competitive benefits and work-life balance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
              <div className="space-y-4">
                {openPositions.map(position => (
                  <div key={position.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{position.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {position.department}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {position.location}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setFormData(prev => ({ ...prev, position: position.title }));
                          setIsFormOpen(true);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isFormOpen && (
              <div className="mt-8 border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Apply for {formData.position}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
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
                      <Label htmlFor="resume">Resume/CV (PDF)</Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={5}
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsFormOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Submit Application</Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Careers;
