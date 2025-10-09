import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Components = () => {
  const filterTabs = ["ALL", "HTML", "CSS", "Figma", "JavaScript"];
  
  const componentItems = [
    {
      id: 1,
      title: "Click me!",
      type: "button",
      gradient: false
    },
    {
      id: 2,
      title: "BUTTON",
      type: "button",
      gradient: true
    },
    {
      id: 1,
      title: "3D Icon",
      type: "icon",
      gradient: false
    },
    {
      id: 1,
      title: "Social Icons",
      type: "icons",
      gradient: false
    },
    {
      id: 1,
      title: "Search Input",
      type: "input",
      gradient: false
    },
    {
      id: 3,
      title: "Click me!",
      type: "button",
      gradient: false
    },
    {
      id: 2,
      title: "Search Bar",
      type: "input",
      gradient: true
    },
    {
      id: 1,
      title: "Color Picker",
      type: "picker",
      gradient: true
    },
    {
      id: 1,
      title: "Hover For Tooltip",
      type: "tooltip",
      gradient: false
    },
    {
      id: 4,
      title: "See more",
      type: "button",
      gradient: true
    },
    {
      id: 5,
      title: "Explore More",
      type: "button",
      gradient: true
    },
    {
      id: 1,
      title: "3D Object",
      type: "3d",
      gradient: false
    }
  ];

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-primary">Components</span> Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore polished, scalable components — from simple buttons to full 
            dashboards — in both design and code.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg">
            {filterTabs.map((tab) => (
              <Button 
                key={tab}
                variant={tab === "ALL" ? "default" : "ghost"}
                className={tab === "ALL" 
                  ? "bg-gradient-primary border-0 hover:opacity-90" 
                  : "hover:bg-secondary"
                }
                size="sm"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {componentItems.map((item, index) => (
            <Link key={index} to={`/components/${item.type}/${item.id}`}>
              <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
              <CardContent className="p-8 aspect-square flex items-center justify-center">
                {item.type === "button" && (
                  <Button 
                    className={item.gradient 
                      ? "bg-gradient-primary hover:opacity-90 border-0 text-lg px-8 py-3" 
                      : "bg-secondary hover:bg-muted border-border text-lg px-8 py-3"
                    }
                  >
                    {item.title}
                  </Button>
                )}
                
                {item.type === "icon" && (
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <div className="w-10 h-10 bg-background rounded-lg"></div>
                  </div>
                )}
                
                {item.type === "icons" && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { bg: "bg-red-500", icon: "📱" },
                      { bg: "bg-green-500", icon: "🎵" },
                      { bg: "bg-blue-500", icon: "💬" },
                      { bg: "bg-red-600", icon: "📺" }
                    ].map((social, i) => (
                      <div key={i} className={`w-12 h-12 ${social.bg} rounded-lg flex items-center justify-center text-white`}>
                        {social.icon}
                      </div>
                    ))}
                  </div>
                )}
                
                {item.type === "input" && (
                  <div className={`w-full max-w-xs ${item.gradient ? 'bg-gradient-primary p-0.5 rounded-lg' : ''}`}>
                    <div className={`${item.gradient ? 'bg-background rounded-lg' : ''}`}>
                      <input 
                        type="text" 
                        placeholder="Search..."
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
                
                {item.type === "picker" && (
                  <div className="w-32 h-32 bg-gradient-primary rounded-2xl"></div>
                )}
                
                {item.type === "tooltip" && (
                  <div className="relative">
                    <Button variant="outline" className="border-border">
                      Hover For Tooltip
                    </Button>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      This is a tooltip!
                    </div>
                  </div>
                )}
                
                {item.type === "3d" && (
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-primary rounded-2xl transform rotate-12 group-hover:rotate-0 transition-transform"></div>
                    <div className="absolute top-2 left-2 w-24 h-24 bg-primary/50 rounded-2xl transform -rotate-12"></div>
                  </div>
                )}
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
  );
};

export default Components;