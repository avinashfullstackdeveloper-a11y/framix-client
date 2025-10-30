// Admin ComponentsPage: Lists all components with delete access for admin.

import React, { useEffect, useState, useMemo, useRef } from "react";
import ComponentShowcaseCard from "@/components/ComponentShowcaseCard";
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
  htmlCode?: string;
  cssCode?: string;
  tailwind?: string;
  views?: number;
};

const ComponentsPage: React.FC = () => {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = window.location;
  const { toast } = useToast();

  // Ref for scrolling to components grid on page change
  const componentsGridRef = useRef<HTMLDivElement>(null);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      // Fetch only community components with all necessary fields for preview
      const data = await apiRequest<ComponentItem[] | { components: ComponentItem[]; pagination?: any }>(
        "/api/components?publishSection=community&limit=1000&fields=_id,title,type,badge,views,code,htmlCode,cssCode,jsCode,tailwindCode,language,technology"
      );
      // Handle both array response and object with components property
      const componentsArray = Array.isArray(data) ? data : data.components || [];
      setComponents(componentsArray);
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
    if (!window.confirm("Are you sure you want to delete this component?"))
      return;
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
    const savedPage = parseInt(
      new URLSearchParams(location.search).get("page") || "1",
      10
    );
    setCurrentPage(savedPage);
    fetchComponents();
  }, []);

  // OPTIMIZATION: Scroll to top of components grid when page changes
  useEffect(() => {
    if (currentPage > 1 && componentsGridRef.current) {
      componentsGridRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // OPTIMIZATION: Pagination logic - 12 components per page
  const itemsPerPage = 12;
  const totalPages = Math.ceil(components.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComponents = useMemo(() => {
    return components.slice(startIndex, endIndex);
  }, [components, startIndex, endIndex]);

  // OPTIMIZATION: OptimizedPreview component with lazy loading via Intersection Observer
  // This prevents rendering iframes (and loading external CDNs) until they're visible
  const OptimizedPreview = React.memo(
    ({ componentItem }: { componentItem: ComponentItem }) => {
      const [isVisible, setIsVisible] = useState(false);
      const containerRef = useRef<HTMLDivElement>(null);

      // OPTIMIZATION: Intersection Observer to detect when component enters viewport
      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                // Once visible, stop observing to prevent unnecessary checks
                observer.disconnect();
              }
            });
          },
          {
            rootMargin: "50px", // Start loading 50px before entering viewport
            threshold: 0.1,
          }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }, []);

      // OPTIMIZATION: Memoize srcDoc generation to prevent recreation on every render
      const previewContent = useMemo(() => {
        if (!isVisible) return null;

        // Tailwind preview (language or technology)
        if (
          componentItem.language &&
          (componentItem.language.toLowerCase() === "tailwind" ||
            componentItem.language.toLowerCase() === "tailwindcss") &&
          (componentItem.code || componentItem.tailwind)
        ) {
          const tailwindHtml =
            componentItem.code || componentItem.tailwind || "";
          const srcDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: transparent;
                  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              ${tailwindHtml}
            </body>
          </html>
        `;
          return (
            <iframe
              title="Preview"
              srcDoc={srcDoc}
              className="w-full h-full rounded-lg border-0"
              style={{
                margin: 0,
                padding: 0,
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }

        // Direct full HTML document preview (zoomed out)
        if (
          typeof componentItem.code === "string" &&
          componentItem.code.trim().startsWith("<!DOCTYPE html")
        ) {
          return (
            <iframe
              title="Preview"
              srcDoc={componentItem.code}
              className="w-full h-full rounded-lg border-0"
              style={{
                margin: 0,
                padding: 0,
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }

        // React preview (iframe Babel)
        if (
          componentItem.language &&
          componentItem.language.toLowerCase() === "react"
        ) {
          const srcDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: transparent;
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  ${componentItem.code}
                  if (typeof Component !== "undefined") {
                    ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
                  }
                } catch (e) {
                  document.getElementById('root').innerHTML = '<pre style="color:red;">' + e.toString() + '</pre>';
                }
              </script>
            </body>
          </html>
        `;
          return (
            <iframe
              title="Preview"
              srcDoc={srcDoc}
              className="w-full h-full rounded-lg border-0"
              style={{
                margin: 0,
                padding: 0,
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }

        // Multi preview
        if (
          componentItem.language &&
          componentItem.language.toLowerCase() === "multi"
        ) {
          // Build srcDoc from separate fields if code field is missing
          const srcDoc =
            componentItem.code ||
            `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: transparent;
                  overflow: hidden;
                }
                ${componentItem.cssCode || ""}
              </style>
            </head>
            <body>
              ${componentItem.htmlCode || ""}
            </body>
          </html>
        `;

          return (
            <iframe
              title="Preview"
              srcDoc={srcDoc}
              className="border-0"
              style={{
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
                overflow: "hidden",
                background: "transparent",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }

        // CSS + HTML combined preview (if both present)
        if (
          componentItem.language &&
          componentItem.language.toLowerCase() === "css" &&
          componentItem.htmlCode &&
          componentItem.cssCode
        ) {
          const srcDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: transparent;
                  overflow: hidden;
                }
                ${componentItem.cssCode}
              </style>
            </head>
            <body>
              ${componentItem.htmlCode}
            </body>
          </html>
        `;
          return (
            <iframe
              title="Preview"
              srcDoc={srcDoc}
              className="w-full h-full rounded-lg border-0"
              style={{
                margin: 0,
                padding: 0,
                background: "transparent",
                width: "100%",
                height: "100%",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }

        // Fallback: HTML/CSS/JS preview
        const srcDoc = `<!DOCTYPE html>
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
                componentItem.language &&
                componentItem.language.toLowerCase() === "css"
                  ? componentItem.code
                  : ""
              }
            </style>
          </head>
          <body>
            <div id="preview-wrapper">
              ${
                componentItem.language &&
                componentItem.language.toLowerCase() === "html"
                  ? componentItem.code
                  : ""
              }
            </div>
            <script>${
              componentItem.language &&
              componentItem.language.toLowerCase() === "javascript"
                ? componentItem.code
                : ""
            }</script>
          </body>
        </html>`;
        return (
          <iframe
            title="Preview"
            srcDoc={srcDoc}
            className="w-full h-full rounded-lg border-0"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              width: "100%",
              height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }, [isVisible, componentItem]);

      // OPTIMIZATION: Return placeholder until component is visible
      if (!isVisible) {
        return (
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
            style={{ minHeight: "200px" }}
          >
            <div className="text-muted-foreground text-sm">
              Loading preview...
            </div>
          </div>
        );
      }

      return <>{previewContent}</>;
    }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-[#FF479C]">Admin</span> Components
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#767676] max-w-3xl mx-auto px-4">
          Manage all uploaded components with full administrative control and
          preview capabilities.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Component className="w-4 h-4 text-[#FF479C]" />
              <span className="text-white">{components.length}</span>
              <span className="text-[#767676]">Total Components</span>
            </div>
            <div className="w-px h-6 bg-[#3A3A3A]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF479C] font-medium">Admin Access</span>
              <span className="text-[#767676]">Full Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div
        ref={componentsGridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto"
      >
        {loading ? (
          <div className="text-center text-lg text-white w-full col-span-3 py-12">
            Loading components...
          </div>
        ) : components.length === 0 ? (
          <div className="text-center w-full col-span-3 py-16">
            <Component className="w-16 h-16 text-[#767676] mx-auto mb-4" />
            <p className="text-[#767676] text-lg">No components found</p>
            <p className="text-[#767676] text-sm mt-1">
              Upload some components to get started
            </p>
          </div>
        ) : (
          paginatedComponents.map((item) => (
            <ComponentShowcaseCard
              key={item._id}
              componentItem={item}
              onClick={() => {
                navigate(
                  `/components/${item.type}/${item._id}?page=${currentPage}`
                );
              }}
              onDelete={user?.role === "admin" ? handleDelete : undefined}
            />
          ))
        )}
      </div>

      {/* OPTIMIZATION: Pagination Controls - At the end of all components */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              setCurrentPage(newPage);
              navigate(`?page=${newPage}`);
            }}
            disabled={currentPage === 1}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]"
                : "bg-[#FF479C] text-[#282828] hover:opacity-90"
            }`}
          >
            Previous
          </button>

          <span className="text-sm sm:text-base text-[#767676]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, totalPages);
              setCurrentPage(newPage);
              navigate(`?page=${newPage}`);
            }}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === totalPages
                ? "bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]"
                : "bg-[#FF479C] text-[#282828] hover:opacity-90"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentsPage;
