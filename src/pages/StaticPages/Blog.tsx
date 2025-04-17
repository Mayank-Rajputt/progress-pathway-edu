
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  // Sample blog posts - in a real application, these would come from a database
  const blogPosts = [
    {
      id: 1,
      title: "Integrating Technology in Classrooms: Best Practices",
      excerpt: "Learn how educational institutions are leveraging technology to enhance learning experiences.",
      date: "April 15, 2025",
      author: "Dr. Sarah Johnson",
      category: "Education Technology"
    },
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
    }
  ];

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Trakdemy Blog</CardTitle>
          <p className="text-muted-foreground">
            Educational insights, product updates, and industry trends
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {blogPosts.map(post => (
              <div key={post.id} className="border-b pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold mb-2 hover:text-primary cursor-pointer">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                    {post.category}
                  </span>
                </div>
                <p className="mb-4">{post.excerpt}</p>
                <button className="text-primary hover:underline text-sm font-medium">
                  Read more →
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to stay updated with our latest articles and updates?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;
