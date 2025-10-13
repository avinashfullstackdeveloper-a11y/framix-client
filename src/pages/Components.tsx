import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Components = () => {
  const filterTabs = ["ALL", "HTML", "CSS", "Figma", "JavaScript"];
  type ComponentItem = {
    _id: string;
    title: string;
    type: string;
    code?: string;
    language?: string;
  };
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    if (!user || user.role !== "admin") return;
    if (!window.confirm("Are you sure you want to delete this component?")) return;
    try {
      const res = await fetch(`/api/components/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete component");
      setComponents((prev: ComponentItem[]) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error deleting component");
    }
  };

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
        {/* Admin Upload Button */}
        {user?.role === "admin" && (
          <div className="flex justify-center mb-8">
            <button
              className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
              onClick={() => navigate("/admin-component-upload")}
            >
              Upload New Component
            </button>
          </div>
        )}

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
            components.map((item: { _id: string; title: string; type: string; code?: string; language?: string }) => (
              <div
                key={item._id}
                onClick={() => navigate(`/components/${item.type}/${item._id}`)}
                className="cursor-pointer"
              >
                <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-8 aspect-square flex flex-col items-center justify-center">
                    <div className="mb-4 text-xl font-semibold">{item.title}</div>
                    <div className="mb-2 text-sm text-muted-foreground">{item.type}</div>
                    {/* Preview based on code and language */}
                    {item.language && item.code && (
                      item.language.toLowerCase() === "react" ? (
                        <div className="w-full aspect-square flex items-center justify-center bg-neutral-900 rounded-lg overflow-auto">
                          <LiveProvider code={item.code}>
                            <LivePreview />
                            <LiveError className="live-error" />
                          </LiveProvider>
                        </div>
                      ) : (
                        <iframe
                          title="Preview"
                          srcDoc={`<!DOCTYPE html>
                            <html>
                              <head>
                                <style>
                                  body { margin: 0; padding: 10px; background: #f8f9fa; }
                                  ${item.language.toLowerCase() === "css" ? item.code : ""}
                                </style>
                              </head>
                              <body>
                                ${item.language.toLowerCase() === "html" ? item.code : ""}
                                <script>${item.language.toLowerCase() === "javascript" ? item.code : ""}</script>
                              </body>
                            </html>`}
                          className="w-full aspect-square min-h-[6rem] rounded-lg border overflow-auto"
                        />
                      )
                    )}
                    {/* Admin delete button */}
                    {user?.role === "admin" && (
                      <button
                        className="mt-4 px-3 py-1 bg-red-600 text-white rounded text-xs"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        Delete
                      </button>
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