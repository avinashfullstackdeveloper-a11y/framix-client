import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AdminComponentUpload from "./AdminComponentUpload";

import { useAuth } from "../context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Components = () => {
  const filterTabs = [
    "All",
    "Buttons",
    "Cards",
    "Checkbox",
    "Loaders",
    "Inputs",
    "Radio Buttons",
    "Forms",
    "Tooltips",
  ];
  type ComponentItem = {
    _id: string;
    title: string;
    type: string;
    code?: string;
    language?: string;
    badge?: "Free" | "Pro";
    stats?: string;
  };
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filterTabs[0]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchComponents = () => {
    setLoading(true);
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => {
        setComponents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!user || user.role !== "admin") return;
    if (!window.confirm("Are you sure you want to delete this component?"))
      return;
    try {
      const res = await fetch(`/api/components/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete component");
      setComponents((prev: ComponentItem[]) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      alert("Error deleting component");
    }
  };

  useEffect(() => {
    fetchComponents();
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition">
                Upload New Component
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AdminComponentUpload
                onUploadSuccess={() => {
                  setDialogOpen(false);
                  fetchComponents();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex gap-4 flex-wrap justify-center items-center w-full max-w-xl mx-auto">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`flex w-28 h-10 justify-center items-center border cursor-pointer transition-all duration-300 ease-in-out rounded-[10px] border-solid ${
                activeFilter === filter
                  ? "bg-[#FF9AC9] border-[#FF9AC9] text-[#282828]"
                  : "bg-[rgba(0,0,0,0.80)] border-[#767676] text-white hover:border-[#FF9AC9]"
              }`}
            >
              <span className="text-sm font-medium truncate px-2">
                {filter}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
        {loading ? (
          <div className="text-center text-lg w-full">Loading...</div>
        ) : (
          components.map((item: ComponentItem) => (
            <div
              key={item._id}
              onClick={() => navigate(`/components/${item.type}/${item._id}`)}
              className="cursor-pointer"
            >
              <div className="flex w-full sm:w-[411px] h-[269px] flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF9AC9] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] bg-black pt-2.5 pb-0 px-4 rounded-[30px] border-solid border-[#3A3A3A] max-md:w-[calc(50%_-_10px)] max-sm:w-full max-sm:h-60 cursor-pointer group">
                <div className="flex h-[251px] flex-col justify-center items-center shrink-0 self-stretch absolute w-[379px] bg-black px-14 py-[121px] rounded-[30px] left-4 top-2.5 max-sm:h-[220px] max-sm:px-10 max-sm:py-[100px] group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease]">
                  {/* Preview based on code and language */}
                  {item.language &&
                    item.code &&
                    (item.language.toLowerCase() === "react" ? (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-lg overflow-hidden">
                        <LiveProvider code={item.code}>
                          <style>{`body,html,#root{margin:0;padding:0;box-sizing:border-box;overflow:hidden;}`}</style>
                          <LivePreview />
                          <LiveError className="live-error" />
                        </LiveProvider>
                      </div>
                    ) : item.language.toLowerCase() === "multi" ? (
                      <iframe
                        title="Preview"
                        srcDoc={item.code}
                        className="w-full h-full min-h-[6rem] rounded-lg border overflow-auto"
                      />
                    ) : (
                      <iframe
                        title="Preview"
                        srcDoc={`<!DOCTYPE html>
                            <html>
                              <head>
                                <style>
                                  body { margin: 0; padding: 10px; background: #f8f9fa; }
                                  ${
                                    item.language.toLowerCase() === "css"
                                      ? item.code
                                      : ""
                                  }
                                </style>
                              </head>
                              <body>
                                ${
                                  item.language.toLowerCase() === "html"
                                    ? item.code
                                    : ""
                                }
                                <script>${
                                  item.language.toLowerCase() === "javascript"
                                    ? item.code
                                    : ""
                                }</script>
                              </body>
                            </html>`}
                        className="w-full h-full min-h-[6rem] rounded-lg border overflow-auto"
                      />
                    ))}
                </div>
                <div className="flex w-[359px] flex-col justify-center items-start absolute h-11 z-10 left-[26px] bottom-0 max-sm:w-[calc(100%_-_32px)] max-sm:left-4">
                  <div className="flex justify-between items-center self-stretch mb-2.5">
                    <h3 className="flex-[1_0_0] text-white text-base font-semibold max-sm:text-sm transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                      {item.title}
                    </h3>
                    <div className="flex justify-center items-center rounded pl-3 pr-[11px] pt-[3px] pb-0.5 transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                      <span
                        className={`text-sm font-normal max-sm:text-xs ${
                          item.badge === "Pro" ? "text-[#FF9AC9]" : "text-white"
                        }`}
                      >
                        {item.badge || "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-[45px] items-center gap-1.5">
                    <span className="text-white text-[13px] font-light max-sm:text-xs">
                      {item.stats || ""}
                    </span>
                  </div>
                </div>
                {/* Admin delete button */}
                {user?.role === "admin" && (
                  <button
                    className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded text-xs z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
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

export default Components;
