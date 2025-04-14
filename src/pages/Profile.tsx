
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCog, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
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
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={isUploading} asChild>
                  <label className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    {isUploading ? "Uploading..." : "Upload Picture"}
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
            
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="capitalize font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
