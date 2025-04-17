
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Tag, ArrowRight, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Blog = () => {
  const [email, setEmail] = useState('');
  
  // Sample blog posts - in a real application, these would come from a database
  const featuredPost = {
    id: 1,
    title: "Integrating Technology in Classrooms: Best Practices",
    excerpt: "Learn how educational institutions are leveraging technology to enhance learning experiences.",
    content: "The integration of technology in education has transformed the traditional classroom experience. From interactive whiteboards to virtual reality simulations, technology offers innovative ways to engage students and enhance learning outcomes. This article explores effective strategies for seamlessly incorporating digital tools into educational settings.",
    date: "April 15, 2025",
    author: "Dr. Sarah Johnson",
    category: "Education Technology",
    image: "/lovable-uploads/098aba0b-f4d7-4326-ac4f-d97268594b9e.png"
  };
  
  const blogPosts = [
    {
      id: 2,
      title: "The Future of Student Information Systems",
      excerpt: "Exploring how AI and data analytics are transforming student management platforms.",
      date: "April 10, 2025",
      author: "Prof. Michael Chen",
      category: "EdTech Trends"
    },
    {
      id: 3,
      title: "Improving Parent-Teacher Communication Through Technology",
      excerpt: "How digital platforms are bridging the gap between educators and parents.",
      date: "April 5, 2025",
      author: "Emily Rodriguez",
      category: "Communication"
    },
    {
      id: 4,
      title: "Data Security in Educational Platforms",
      excerpt: "Best practices for protecting sensitive student information in digital environments.",
      date: "April 2, 2025",
      author: "Alex Thompson",
      category: "Security"
    },
    {
      id: 5,
      title: "Personalized Learning Paths: The Future of Education",
      excerpt: "How adaptive learning technologies are customizing education for individual students.",
      date: "March 28, 2025",
      author: "Dr. James Wilson",
      category: "Education Innovation"
    }
  ];

  // Categories for filtering
  const categories = [
    "All Categories",
    "Education Technology",
    "EdTech Trends",
    "Communication",
    "Security",
    "Education Innovation"
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // In a real application, this would send the email to a subscription service
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail('');
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Trakdemy Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest educational insights, product updates, and industry trends
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      {/* Featured Post */}
      <Card className="mb-12 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100">
            <img 
              src={featuredPost.image} 
              alt="Featured post" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <Badge className="mb-3">{featuredPost.category}</Badge>
            <h2 className="text-2xl font-bold mb-3 hover:text-primary cursor-pointer">
              {featuredPost.title}
            </h2>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Calendar size={14} className="mr-1" />
              <span>{featuredPost.date}</span>
              <span className="mx-2">•</span>
              <User size={14} className="mr-1" />
              <span>{featuredPost.author}</span>
            </div>
            <p className="mb-4">{featuredPost.content}</p>
            <Button variant="link" className="px-0 flex items-center">
              Read more <ArrowRight className="ml-1" size={16} />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Blog Posts */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="space-y-8">
            {blogPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <Badge className="mb-3">{post.category}</Badge>
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary cursor-pointer">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar size={14} className="mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <p className="mb-4">{post.excerpt}</p>
                  <Button variant="link" className="px-0 flex items-center">
                    Read more <ArrowRight className="ml-1" size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More Articles</Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-muted"
                    >
                      <Tag size={14} className="mr-2" />
                      {category}
                      <ChevronRight size={16} className="ml-auto" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Subscribe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get the latest articles and educational insights delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe}>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 rounded-md border focus-visible:ring-1 focus-visible:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
