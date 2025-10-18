// Admin ComponentsPage: Lists all components with delete access for admin.

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Trash2, Component } from "lucide-react";

type ComponentItem = {
  _id: string;
  title: string;
  type: string;
  code?: string;
  language?: string;
  badge?: "Free" | "Pro";
  stats?: string;
};

const ComponentsPage: React.FC = () => {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<ComponentItem[]>("/api/components");
      setComponents(data);
    } catch (err) {
      toast({
        title: "Failed to fetch components",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || user.role !== "admin") return;
    if (!window.confirm("Are you sure you want to delete this component?")) return;
    try {
      await apiRequest(`/api/components/${id}`, { method: "DELETE" });
      setComponents((prev) => prev.filter((c) => c._id !== id));
      toast({
        title: "Component deleted successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error deleting component",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-[#FF9AC9]">Admin</span> Components
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#767676] max-w-3xl mx-auto px-4">
          Manage all uploaded components with full administrative control and preview capabilities.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Component className="w-4 h-4 text-[#FF9AC9]" />
              <span className="text-white">{components.length}</span>
              <span className="text-[#767676]">Total Components</span>
            </div>
            <div className="w-px h-6 bg-[#3A3A3A]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF9AC9] font-medium">Admin Access</span>
              <span className="text-[#767676]">Full Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto">
        {loading ? (
          <div className="text-center text-lg text-white w-full col-span-3 py-12">
            Loading components...
          </div>
        ) : components.length === 0 ? (
          <div className="text-center w-full col-span-3 py-16">
            <Component className="w-16 h-16 text-[#767676] mx-auto mb-4" />
            <p className="text-[#767676] text-lg">No components found</p>
            <p className="text-[#767676] text-sm mt-1">Upload some components to get started</p>
          </div>
        ) : (
          components.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/components/${item.type}/${item._id}`)}
              className="cursor-pointer w-full"
            >
              <div className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF9AC9] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] bg-black pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group">
                
                {/* Component Preview */}
                <div className="flex h-[calc(100%-5rem)] flex-col justify-center items-center shrink-0 absolute w-[calc(100%-4rem)] bg-black rounded-2xl sm:rounded-3xl left-8 top-4 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden">
                  {item.language && item.code && (
                    item.language.toLowerCase() === "react" ? (
                      <div className="w-full h-full flex items-center justify-center" style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
                        <LiveProvider code={item.code}>
                          <style>{`body,html,#root{margin:0;padding:0;box-sizing:border-box;overflow:hidden;}`}</style>
                          <LivePreview />
                          <LiveError className="live-error" />
                        </LiveProvider>
                      </div>
                    ) : item.language.toLowerCase() === "multi" ? (
                      <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <iframe
                          title="Preview"
                          srcDoc={item.code}
                          className="border-0"
                          style={{
                            width: '160%',
                            height: '160%',
                            margin: 0,
                            padding: 0,
                            transform: 'scale(0.6)',
                            transformOrigin: 'center',
                            overflow: 'hidden'
                          }}
                          sandbox="allow-scripts"
                        />
                      </div>
                    ) : (
                      <iframe
                        title="Preview"
                        srcDoc={`<!DOCTYPE html>
                            <html>
                              <head>
                                <style>
                                  * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                  }
                                  body, html {
                                    width: 100%;
                                    height: 100%;
                                    overflow: hidden;
                                    background: transparent;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                  }
                                  #preview-wrapper {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transform: scale(0.5);
                                    transform-origin: center;
                                  }
                                  ${
                                    item.language.toLowerCase() === "css"
                                      ? item.code
                                      : ""
                                  }
                                </style>
                              </head>
                              <body>
                                <div id="preview-wrapper">
                                  ${
                                    item.language.toLowerCase() === "html"
                                      ? item.code
                                      : ""
                                  }
                                </div>
                                <script>${
                                  item.language.toLowerCase() === "javascript"
                                    ? item.code
                                    : ""
                                }</script>
                              </body>
                            </html>`}
                        className="w-full h-full rounded-lg border-0"
                        style={{ margin: 0, padding: 0 }}
                      />
                    )
                  )}
                </div>

                {/* Component Info */}
                <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
                  <div className="flex justify-between items-center self-stretch mb-1 sm:mb-2.5">
                    <h3 className="flex-[1_0_0] text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                      {item.title}
                    </h3>
                    <div className="flex justify-center items-center rounded pl-2 sm:pl-3 pr-2 sm:pr-[11px] pt-[2px] sm:pt-[3px] pb-0.5 transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                      <span
                        className={`text-xs sm:text-sm font-normal ${
                          item.badge === "Pro" ? "text-[#FF9AC9]" : "text-white"
                        }`}
                      >
                        {item.badge || "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-xs sm:text-[13px] font-light">
                      {item.type} • {item.stats || ""}
                    </span>
                  </div>
                </div>

                {/* Admin Delete Button */}
                {user?.role === "admin" && (
                  <button
                    className="absolute top-3 right-3 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 rounded-lg text-xs font-medium transition-all duration-300 z-20 flex items-center gap-1 group/delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 group-hover/delete:scale-110 transition-transform" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComponentsPage;