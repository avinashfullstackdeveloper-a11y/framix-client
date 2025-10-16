import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for components
  const featuredComponents = [
    {
      title: "Animated Navigation",
      description: "Smooth hover animations with gradient backgrounds",
      author: {
        name: "Alex Chen",
        username: "@alexchen",
        initials: "AC"
      },
      likes: 245,
      comments: 32,
      category: "Navigation",
      preview: "/assets/videos/comp1.mp4"
    },
    {
      title: "Data Dashboard",
      description: "Interactive charts and real-time metrics display",
      author: {
        name: "Sarah Kim",
        username: "@sarahk",
        initials: "SK"
      },
      likes: 189,
      comments: 21,
      category: "Dashboard",
      preview: "/assets/videos/comp2.mp4"
    },
    {
      title: "E-commerce Card",
      description: "Product card with image gallery and quick actions",
      author: {
        name: "Mike Rodriguez",
        username: "@miker",
        initials: "MR"
      },
      likes: 156,
      comments: 18,
      category: "E-commerce",
      preview: "/assets/videos/comp3.mp4"
    },
    {
      title: "Contact Form",
      description: "Modern form with validation and success states",
      author: {
        name: "Jessica Wang",
        username: "@jessw",
        initials: "JW"
      },
      likes: 132,
      comments: 15,
      category: "Forms",
      preview: "/assets/videos/comp4.mp4"
    }
  ];

  const allComponents = [
    {
      title: "Pricing Table",
      description: "Three-tier pricing with toggle animation",
      author: {
        name: "David Park",
        username: "@davidp",
        initials: "DP"
      },
      likes: 98,
      comments: 12,
      category: "Pricing"
    },
    {
      title: "User Profile",
      description: "Compact profile card with social links",
      author: {
        name: "Lisa Thompson",
        username: "@lisat",
        initials: "LT"
      },
      likes: 87,
      comments: 8,
      category: "Profile"
    },
    {
      title: "Notification System",
      description: "Toast notifications with different states",
      author: {
        name: "Ryan Smith",
        username: "@ryans",
        initials: "RS"
      },
      likes: 76,
      comments: 11,
      category: "UI"
    },
    {
      title: "Loading Animation",
      description: "Elegant skeleton loading for content",
      author: {
        name: "Emma Davis",
        username: "@emmad",
        initials: "ED"
      },
      likes: 143,
      comments: 9,
      category: "Animation"
    },
    {
      title: "Search Interface",
      description: "Advanced search with filters and suggestions",
      author: {
        name: "Kevin Brown",
        username: "@kevinb",
        initials: "KB"
      },
      likes: 112,
      comments: 14,
      category: "Search"
    },
    {
      title: "Calendar Widget",
      description: "Interactive calendar with event markers",
      author: {
        name: "Maria Garcia",
        username: "@mariag",
        initials: "MG"
      },
      likes: 94,
      comments: 7,
      category: "Widget"
    }
  ];

  // Avatar Component
  const Avatar = ({ initials, size = "sm", className = "" }: { initials: string; size?: "sm" | "md" | "lg"; className?: string }) => {
    const sizeClasses = {
      sm: "w-6 h-6 text-xs",
      md: "w-8 h-8 text-sm",
      lg: "w-12 h-12 text-base"
    };

    return (
      <div className={`flex items-center justify-center bg-gradient-primary rounded-full ${sizeClasses[size]} ${className}`}>
        <span className="text-primary-foreground font-medium">{initials}</span>
      </div>
    );
  };

  // InteractionButtons Component
  const InteractionButtons = ({ likes, comments }: { likes: number; comments: number }) => {
    return (
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M13.1165 9.67708C14.1099 8.70375 15.1165 7.53708 15.1165 6.01042C15.1165 5.03796 14.7302 4.10533 14.0426 3.41769C13.355 2.73006 12.4223 2.34375 11.4499 2.34375C10.2765 2.34375 9.44987 2.67708 8.44987 3.67708C7.44987 2.67708 6.6232 2.34375 5.44987 2.34375C4.47741 2.34375 3.54478 2.73006 2.85714 3.41769C2.16951 4.10533 1.7832 5.03796 1.7832 6.01042C1.7832 7.54375 2.7832 8.71042 3.7832 9.67708L8.44987 14.3438L13.1165 9.67708Z" 
              fill="#F14336" 
              stroke="white" 
              strokeOpacity="0.6" 
              strokeWidth="1.33333" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-muted-foreground text-xs font-normal">
            {likes}
          </span>
        </button>
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M6.12865 13.677C7.40103 14.3297 8.8647 14.5064 10.2559 14.1755C11.6471 13.8445 12.8743 13.0275 13.7165 11.8717C14.5586 10.716 14.9603 9.29742 14.849 7.87173C14.7378 6.44603 14.121 5.10693 13.1099 4.09575C12.0987 3.08456 10.7596 2.46779 9.33387 2.35656C7.90817 2.24534 6.48963 2.64698 5.33386 3.48912C4.17809 4.33125 3.36111 5.55849 3.03013 6.94969C2.69915 8.34089 2.87594 9.80457 3.52865 11.077L2.19531 15.0103L6.12865 13.677Z" 
              stroke="white" 
              strokeOpacity="0.6" 
              strokeWidth="1.33333" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-muted-foreground text-xs font-normal">
            {comments}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Discover
          <span className="text-primary"> Incredible</span>
          <br />
          Components from Creators
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Browse thousands of production-ready UI components built by talented designers and developers from around the world.
        </p>
        <div className="flex gap-4 justify-center max-sm:flex-col max-sm:items-center">
          <button className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-opacity">
            Browse components
          </button>
          <button className="border border-primary/50 hover:bg-secondary px-8 py-3 rounded-full font-medium transition-colors">
            Submit yours
          </button>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg border border-border transition-colors">
              <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7995 2.66675H10.1328" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.46647 2.66675H2.7998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.7998 8H8.7998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.13314 8H2.7998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.8001 13.3333H11.4668" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.7998 13.3333H2.7998" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.1328 1.33325V3.99992" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.13281 6.66675V9.33341" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.4668 12V14.6667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Categories</span>
            </button>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              All Components
            </Badge>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2 14L11.3066 11.1067" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.53255 12.6667C10.4781 12.6667 12.8659 10.2789 12.8659 7.33333C12.8659 4.38781 10.4781 2 7.53255 2C4.58703 2 2.19922 4.38781 2.19922 7.33333C2.19922 10.2789 4.58703 12.6667 7.53255 12.6667Z" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Featured Components Section */}
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Components</h2>
          <p className="text-muted-foreground">Hand-picked components from top creators</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredComponents.map((component, index) => (
            <Link to={`/components/${component.title}`} key={index}>
              <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-video rounded-t-lg relative overflow-hidden">
                    <video 
                      src={component.preview} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{component.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{component.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar 
                          initials={component.author.initials} 
                          size="sm"
                        />
                        <div>
                          <div className="text-sm font-medium">{component.author.name}</div>
                          <div className="text-xs text-muted-foreground">{component.author.username}</div>
                        </div>
                      </div>
                      <InteractionButtons likes={component.likes} comments={component.comments} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* All Components Section */}
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">All Components</h2>
          <p className="text-muted-foreground">Explore the complete collection of community components</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allComponents.map((component, index) => (
            <Link to={`/components/${component.title}`} key={index}>
              <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {component.category}
                    </Badge>
                    <InteractionButtons likes={component.likes} comments={component.comments} />
                  </div>
                  
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/30">{component.author.initials}</div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{component.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{component.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Avatar 
                      initials={component.author.initials} 
                      size="sm"
                    />
                    <div>
                      <div className="text-sm font-medium">{component.author.name}</div>
                      <div className="text-xs text-muted-foreground">{component.author.username}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-gradient-card rounded-2xl border border-border">
        <h2 className="text-3xl font-bold mb-4">
          Share your creations
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators sharing their best work with the community
        </p>
        <button className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-opacity">
          Submit Component
        </button>
      </div>
    </div>
  );
};

export default Community;