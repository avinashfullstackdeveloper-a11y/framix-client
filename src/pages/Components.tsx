

import { useAuth } from "../context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  };
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(filterTabs[0]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchComponents = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/components`, { credentials: "include" })
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/components/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-primary">Components</span> Showcase
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto">
        {loading ? (
          <div className="text-center text-lg w-full col-span-3">
            Loading...
          </div>
        ) : (
          // Filter components based on activeFilter
          components
            .filter((item: ComponentItem) => {
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
            })
            .map((item: ComponentItem) => (
              <div
                key={item._id}
                onClick={() => navigate(`/components/${item.type?.replace(/component/gi, '').trim().replace(/^\w/, c => c.toUpperCase())}/${item._id}`)}
                className="cursor-pointer w-full"
              >
              <div className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF9AC9] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] bg-black pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group">
                <div className="flex h-full flex-col justify-center items-center shrink-0 absolute w-full bg-black rounded-2xl sm:rounded-3xl left-0 top-0 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden">
                  {/* Preview based on code and language */}
                  {item.language &&
                    item.code &&
                    (() => {
                      // Tailwind preview (language or technology)
                      if (
                        (item.language && item.language.toLowerCase() === "tailwind" && item.code) ||
                        (item.language && item.language.toLowerCase() === "tailwindcss" && item.code)
                      ) {
                        const tailwindHtml = item.code || "";
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
                          </div>
                        );
                      }
                      // Direct full HTML document preview (zoomed out)
                      if (
                        typeof item.code === "string" &&
                        item.code.trim().startsWith("<!DOCTYPE html")
                      ) {
                        return (
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
                            <iframe
                              title="Preview"
                              srcDoc={item.code}
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
                          </div>
                        );
                      }
                      // React preview (iframe Babel)
                      if (item.language.toLowerCase() === "react") {
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
                                  ${item.code}
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
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              transform: "scale(0.6)",
                              transformOrigin: "center",
                            }}
                          >
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
                          </div>
                        );
                      }
                      // Multi preview
                      if (item.language.toLowerCase() === "multi") {
                        return (
                          <div
                            className="w-full h-full flex items-center justify-center overflow-hidden"
                            style={{
                              transform: "scale(0.6)",
                              transformOrigin: "center",
                            }}
                          >
                            <iframe
                              title="Preview"
                              srcDoc={item.code}
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
                          </div>
                        );
                      }
                      // CSS + HTML combined preview (if both present)
                      if (
                        item.language.toLowerCase() === "css" &&
                        item.htmlCode &&
                        item.cssCode
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
                                ${item.cssCode}
                              </style>
                            </head>
                            <body>
                              ${item.htmlCode}
                            </body>
                          </html>
                        `;
                        return (
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
                          </div>
                        );
                      }
                      // Fallback: HTML/CSS/JS preview
                      return (
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
                            style={{
                              margin: 0,
                              padding: 0,
                              background: "transparent",
                              width: "100%",
                              height: "100%",
                            }}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                      );
                    })()}
                </div>
                <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
                  <div className="flex justify-between items-center self-stretch mb-1 sm:mb-2.5">
                    <h3 className="flex-[1_0_0] text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                      {/* Show cleaned type only, not title */}
                      <span className="block text-base sm:text-lg font-semibold">
                        {item.type?.replace(/component/gi, '').trim().replace(/^\w/, c => c.toUpperCase())}
                      </span>
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
                      {item.stats || ""}
                    </span>
                  </div>
                </div>
                {/* Admin delete button removed */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Components;
