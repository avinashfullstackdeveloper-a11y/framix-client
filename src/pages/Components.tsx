import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Components = () => {
  const filterTabs = ["ALL", "HTML", "CSS", "Figma", "JavaScript"];
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => {
        setComponents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          {loading ? (
            <div className="col-span-3 text-center text-lg">Loading...</div>
          ) : (
            components.map((item: { id: string | number; title: string; type: string; preview?: string }) => (
              <div
                key={item.id}
                onClick={() => navigate(`/components/${item.type}/${item.id}`)}
                className="cursor-pointer"
              >
                <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-8 aspect-square flex flex-col items-center justify-center">
                    <div className="mb-4 text-xl font-semibold">{item.title}</div>
                    <div className="mb-2 text-sm text-muted-foreground">{item.type}</div>
                    {item.preview && (
                      <img
                        src={item.preview}
                        alt={item.title}
                        className="w-24 h-24 object-contain rounded-lg border"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
  );
};

export default Components;