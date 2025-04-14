
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, Upload, X, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '123-456-7890', // Sample data
    department: 'Computer Science', // Sample data
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate image upload process
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfileImage(reader.result);
          // In a real application, you would upload this to your server/storage
          toast.success("Profile picture updated successfully");
        }
      };
      reader.readAsDataURL(file);
      setIsUploading(false);
    }, 1000);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    toast.success("Profile picture removed");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Simulate API call to update profile
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }, 800);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={toggleEdit} variant={isEditing ? "destructive" : "default"}>
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4 group">
                <Avatar className="w-32 h-32 border-4 border-muted">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={user?.name || "Profile"} />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {profileImage && (
                  <button 
                    onClick={removeProfileImage} 
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                )}
                
                <div className="absolute bottom-0 right-0">
                  <Button variant="secondary" size="icon" className="rounded-full h-8 w-8" asChild>
                    <label className="cursor-pointer">
                      <Camera size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </Button>
                </div>
              </div>
              
              {isUploading && (
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-medium">{formData.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-medium">{formData.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-medium">{formData.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="capitalize font-medium">{user?.role}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="font-medium">{formData.department}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter>
            <Button onClick={handleSaveChanges} className="w-full">Save Changes</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Profile;
