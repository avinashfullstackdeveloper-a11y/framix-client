import { useAuth } from "../context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdCard from "../components/AdCard";

const Components = () => {
  // Filter tabs should match the fields in ComponentSelectorPopup.tsx
  const filterTabs = [
    "All",
    "Button",
    "Toggle switch",
    "Checkbox",
    "Card",
    "Loader",
    "Input",
    "Form",
    "Pattern",
    "Radio buttons",
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
    htmlCode?: string;
    cssCode?: string;
    tailwind?: string;
    views?: number;
  };
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(filterTabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ref for scrolling to components grid on page change
  const componentsGridRef = useRef<HTMLDivElement>(null);

  const fetchComponents = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/components`, {
      credentials: "include",
    })
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/components/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
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

  // OPTIMIZATION: Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // OPTIMIZATION: Scroll to top of components grid when page changes
  useEffect(() => {
    if (currentPage > 1 && componentsGridRef.current) {
      componentsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // OPTIMIZATION: Memoize filtered components to prevent recalculation on every render
  const filteredComponents = useMemo(() => {
    return components.filter((item: ComponentItem) => {
      if (activeFilter === "All") return true;
      // Map filter tab to type/title
      switch (activeFilter) {
        case "Button":
          return item.title?.toLowerCase().includes("button");
        case "Toggle switch":
          return item.title?.toLowerCase().includes("toggle");
        case "Checkbox":
          return item.title?.toLowerCase().includes("checkbox");
        case "Card":
          return item.title?.toLowerCase().includes("card");
        case "Loader":
          return item.title?.toLowerCase().includes("loader");
        case "Input":
          return item.title?.toLowerCase().includes("input");
        case "Form":
          return item.title?.toLowerCase().includes("form");
        case "Pattern":
          return item.title?.toLowerCase().includes("pattern");
        case "Radio buttons":
          return item.title?.toLowerCase().includes("radio");
        case "Tooltips":
          return item.title?.toLowerCase().includes("tooltip");
        default:
          return true;
      }
    });
  }, [components, activeFilter]);

  // OPTIMIZATION: Pagination logic - 12 components per page (excluding ads)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComponents = filteredComponents.slice(startIndex, endIndex);

  // OPTIMIZATION: Memoize itemsWithAds array to prevent recalculation
  const itemsWithAds = useMemo(() => {
    const items: Array<ComponentItem | { isAd: true; adIndex: number; adType: '300x250' | '160x300' }> = [];
    paginatedComponents.forEach((component, index) => {
      items.push(component);
      // Insert ad after every 6th component (index 5, 11, 17, etc.)
      if ((index + 1) % 6 === 0 && index < paginatedComponents.length - 1) {
        // Alternate ad types: odd positions get 300x250, even positions get 160x300
        const adCount = Math.floor(index / 6);
        const adType = adCount % 2 === 0 ? '300x250' : '160x300';
        items.push({ isAd: true, adIndex: adCount + (currentPage - 1) * 2, adType });
      }
    });
    return items;
  }, [paginatedComponents, currentPage]);

  // OPTIMIZATION: OptimizedPreview component with lazy loading via Intersection Observer
  // This prevents rendering iframes (and loading external CDNs) until they're visible
  const OptimizedPreview = React.memo(({ componentItem }: { componentItem: ComponentItem }) => {
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
        const tailwindHtml = componentItem.code || componentItem.tailwind || "";
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
      if (componentItem.language && componentItem.language.toLowerCase() === "react") {
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
      if (componentItem.language && componentItem.language.toLowerCase() === "multi") {
        // Build srcDoc from separate fields if code field is missing
        const srcDoc = componentItem.code || `
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
                componentItem.language && componentItem.language.toLowerCase() === "css"
                  ? componentItem.code
                  : ""
              }
            </style>
          </head>
          <body>
            <div id="preview-wrapper">
              ${
                componentItem.language && componentItem.language.toLowerCase() === "html"
                  ? componentItem.code
                  : ""
              }
            </div>
            <script>${
              componentItem.language && componentItem.language.toLowerCase() === "javascript"
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
          <div className="text-muted-foreground text-sm">Loading preview...</div>
        </div>
      );
    }

    return <>{previewContent}</>;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-[#FF9AC9]">Components</span> Showcase
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Explore polished, scalable components — from simple buttons to full
          dashboards — in both design and code.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center items-center w-full max-w-4xl mx-auto px-2">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`flex w-auto min-w-20 sm:min-w-24 lg:w-28 h-8 sm:h-10 justify-center items-center border cursor-pointer transition-all duration-300 ease-in-out rounded-lg sm:rounded-[10px] border-solid ${
                activeFilter === filter
                  ? "bg-[#FF9AC9] border-[#FF9AC9] text-[#282828]"
                  : "bg-[rgba(0,0,0,0.80)] border-[#767676] text-white hover:border-[#FF9AC9]"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium truncate px-2 sm:px-3">
                {filter}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div ref={componentsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto">
        {loading ? (
          <div className="text-center text-lg w-full col-span-3">
            Loading...
          </div>
        ) : (
          itemsWithAds.map((item, index) => {
            // Check if this is an ad item
            if ('isAd' in item && item.isAd) {
              return <AdCard key={`ad-${item.adIndex}`} adKey={`ad-${item.adIndex}`} adType={item.adType} />;
            }

            // Regular component item
            const componentItem = item as ComponentItem;
            return (
              <div
                key={componentItem._id}
                onClick={() =>
                  navigate(
                    `/components/${componentItem.type
                    ?.replace(/component/gi, "")
                    .trim()
                      .replace(/^\w/, (c) => c.toUpperCase())}/${componentItem._id}`
                  )
                }
                className="cursor-pointer w-full"
              >
                <div className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF9AC9] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group" style={{ backgroundColor: "#2d3135" }}>
                  <div className="flex h-full flex-col justify-center items-center shrink-0 absolute w-full rounded-2xl sm:rounded-3xl left-0 top-0 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden" style={{ backgroundColor: "#2d3135" }}>
                    {/* OPTIMIZATION: Use OptimizedPreview component with lazy loading */}
                    {componentItem.language && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <OptimizedPreview componentItem={componentItem} />
                      </div>
                    )}
                  </div>
                  <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
                    <div className="flex justify-between items-center self-stretch mb-1 sm:mb-2.5">
                      <h3 className="flex-[1_0_0] text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                        {/* Show cleaned type only, not title */}
                        <span className="block text-base sm:text-lg font-semibold">
                          {componentItem.type
                          ?.replace(/component/gi, "")
                          .trim()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </span>
                      </h3>
                      <div className="flex justify-center items-center rounded pl-2 sm:pl-3 pr-2 sm:pr-[11px] pt-[2px] sm:pt-[3px] pb-0.5 transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                        <span
                          className={`text-xs sm:text-sm font-normal ${
                            componentItem.badge === "Pro"
                            ? "text-[#FF9AC9]"
                              : "text-white"
                          }`}
                        >
                          {componentItem.badge || "Free"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z"
                          stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-white text-xs font-light">
                        {componentItem.views || 0} views
                      </span>
                    </div>
                  </div>
                  {/* Admin delete button removed */}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* OPTIMIZATION: Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? 'bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]'
                : 'bg-[#FF9AC9] text-[#282828] hover:opacity-90'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm sm:text-base text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === totalPages
                ? 'bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]'
                : 'bg-[#FF9AC9] text-[#282828] hover:opacity-90'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Components;
