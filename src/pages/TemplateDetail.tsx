import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const TemplateDetail = () => {
  // --- Corrected media paths ---
  const media = {
    mainVideo: "/assets/videos/pd1.mp4",
    galleryImages: [
      "/assets/images/pd2.png",
      "/assets/images/pd3.png",
      "/assets/images/pd4.png",
    ],
    relatedProjectVideos: [
      "/assets/videos/a.mp4",
      "/assets/videos/b.mp4",
      "/assets/videos/c.mp4",
    ],
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/templates">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-secondary">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </Link>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Made by Emma</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>100 Views</span>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-primary">Mind Scape</span> - A Mental Wellness 
            App for Gen Z
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            In today's fast-moving world, young people often carry invisible struggles that no 
            one sees. MindScape was designed as a companion, not just an app.
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button className="bg-gradient-primary hover:opacity-90 border-0">
              Preview
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="font-semibold">KFrame</div>
            <div className="text-sm text-muted-foreground">Creator</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="font-semibold">2 Days ago</div>
            <div className="text-sm text-muted-foreground">Updated</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2">
              <span className="text-primary font-bold">3</span>
            </div>
            <div className="font-semibold">Pages</div>
            <div className="text-sm text-muted-foreground">Created</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div className="font-semibold">12.6k</div>
            <div className="text-sm text-muted-foreground">Views</div>
          </div>
        </div>

        {/* Project Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Video */}
          <Card className="bg-gradient-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video">
                <video
                  src={media.mainVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Secondary Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Display first two images */}
            {media.galleryImages.slice(0, 2).map((src, index) => (
              <Card key={index} className="bg-gradient-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square">
                    <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Display third image, spanning two columns */}
            {media.galleryImages[2] && (
              <Card className="bg-gradient-card border-border col-span-2 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video">
                      <img src={media.galleryImages[2]} alt="Gallery image 3" className="w-full h-full object-cover" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">
              About The <span className="text-primary">Mind Scape</span>
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                MindScape is a mental wellness app designed specifically for Gen Z users to tackle 
                stress, loneliness, and anxiety in an engaging way.
              </p>
              <p>
                Unlike traditional wellness apps that often feel too clinical, MindScape blends playful 
                design, gamified features, and calming UI to create a safe digital space for emotional 
                well-being. Our mission is to make mental health approachable, interactive, and fun, 
                while maintaining a professional and trustworthy experience.
              </p>
            </div>

            <h3 className="text-2xl font-bold mt-12 mb-6">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {media.relatedProjectVideos.map((src, index) => (
                <Card key={index} className="bg-gradient-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                        <video
                          src={src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div>
            <Card className="bg-gradient-card border-border p-6 sticky top-8">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-4">Project Details</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Category</div>
                    <Badge variant="secondary">Mental Health</Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Platform</div>
                    <div>Mobile App</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Technology</div>
                    <div>React Native</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Timeline</div>
                    <div>6 months</div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-primary hover:opacity-90 border-0">
                  View Live Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default TemplateDetail;