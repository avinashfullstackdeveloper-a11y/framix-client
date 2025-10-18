// Admin ComponentsPage: Lists all components with delete access for admin.

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
        title: "Component deleted",
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
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-primary">Admin</span> Components
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Manage all uploaded components. Only admins can delete components.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto">
        {loading ? (
          <div className="text-center text-lg w-full col-span-3">Loading...</div>
        ) : components.length === 0 ? (
          <div className="text-center text-lg w-full col-span-3">No components found.</div>
        ) : (
          components.map((item) => (
            <div
              key={item._id}
              className="relative group border rounded-2xl bg-black hover:border-[#FF9AC9] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] transition-all duration-300 p-4 cursor-pointer"
              onClick={() => navigate(`/components/${item.type}/${item._id}`)}
            >
              <div className="mb-2">
                <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                <span className={`ml-2 text-xs ${item.badge === "Pro" ? "text-[#FF9AC9]" : "text-white"}`}>
                  {item.badge || "Free"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{item.type}</div>
              <div className="text-xs text-gray-400 mb-4">{item.stats || ""}</div>
              {user?.role === "admin" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-3 right-3 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComponentsPage;