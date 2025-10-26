import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ComponentSelectorPopup from "@/components/ComponentSelectorPopup";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CommunityUserProfile } from "@/components/CommunityUserProfile";

const CommunityList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  // Types from ComponentSelectorPopup
  const componentTypes = [
    "button",
    "toggle",
    "checkbox",
    "card",
    "loader",
    "input",
    "form",
    "pattern",
    "radio",
    "tooltip",
  ];

  // Fetch approved components from API
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/components`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch components");
        }

        const data = await response.json();
        setComponents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching components:", error);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Get all unique categories from both API and fallback data
  const getAllCategories = () => {
    const apiCategories = components
      .map((c) => c.category || c.type)
      .filter(Boolean);
    const fallbackCategories = [
      ...featuredComponents.map((c) => c.category || c.type),
      ...allComponents.map((c) => c.category || c.type),
    ].filter(Boolean);
    return [
      "All",
      ...Array.from(new Set([...apiCategories, ...fallbackCategories])),
    ];
  };

  // Sample data for components (fallback)
  const featuredComponents = [
    {
      title: "Animated Navigation",
      description: "Smooth hover animations with gradient backgrounds",
      author: {
        name: "Alex Chen",
        username: "@alexchen",
        initials: "AC",
      },
      likes: 245,
      comments: 32,
      category: "Navigation",
      preview: "/assets/videos/comp1.mp4",
    },
    {
      title: "Data Dashboard",
      description: "Interactive charts and real-time metrics display",
      author: {
        name: "Sarah Kim",
        username: "@sarahk",
        initials: "SK",
      },
      likes: 189,
      comments: 21,
      category: "Dashboard",
      preview: "/assets/videos/comp2.mp4",
    },
    {
      title: "E-commerce Card",
      description: "Product card with image gallery and quick actions",
      author: {
        name: "Mike Rodriguez",
        username: "@miker",
        initials: "MR",
      },
      likes: 156,
      comments: 18,
      category: "E-commerce",
      preview: "/assets/videos/comp3.mp4",
    },
    {
      title: "Contact Form",
      description: "Modern form with validation and success states",
      author: {
        name: "Jessica Wang",
        username: "@jessw",
        initials: "JW",
      },
      likes: 132,
      comments: 15,
      category: "Forms",
      preview: "/assets/videos/comp4.mp4",
    },
  ];

  const allComponents = [
    {
      title: "Pricing Table",
      description: "Three-tier pricing with toggle animation",
      author: {
        name: "David Park",
        username: "@davidp",
        initials: "DP",
      },
      likes: 98,
      comments: 12,
      category: "Pricing",
    },
    {
      title: "User Profile",
      description: "Compact profile card with social links",
      author: {
        name: "Lisa Thompson",
        username: "@lisat",
        initials: "LT",
      },
      likes: 87,
      comments: 8,
      category: "Profile",
    },
    {
      title: "Notification System",
      description: "Toast notifications with different states",
      author: {
        name: "Ryan Smith",
        username: "@ryans",
        initials: "RS",
      },
      likes: 76,
      comments: 11,
      category: "UI",
    },
    {
      title: "Loading Animation",
      description: "Elegant skeleton loading for content",
      author: {
        name: "Emma Davis",
        username: "@emmad",
        initials: "ED",
      },
      likes: 143,
      comments: 9,
      category: "Animation",
    },
    {
      title: "Search Interface",
      description: "Advanced search with filters and suggestions",
      author: {
        name: "Kevin Brown",
        username: "@kevinb",
        initials: "KB",
      },
      likes: 112,
      comments: 14,
      category: "Search",
    },
    {
      title: "Calendar Widget",
      description: "Interactive calendar with event markers",
      author: {
        name: "Maria Garcia",
        username: "@mariag",
        initials: "MG",
      },
      likes: 94,
      comments: 7,
      category: "Widget",
    },
  ];

  // Avatar Component
  const Avatar = ({
    initials,
    size = "sm",
    className = "",
  }: {
    initials: string;
    size?: "sm" | "md" | "lg";
    className?: string;
  }) => {
    const sizeClasses = {
      sm: "w-6 h-6 text-xs",
      md: "w-8 h-8 text-sm",
      lg: "w-12 h-12 text-base",
    };

    return (
      <div
        className={`flex items-center justify-center bg-gradient-primary rounded-full ${sizeClasses[size]} ${className}`}
      >
        <span className="text-primary-foreground font-medium">{initials}</span>
      </div>
    );
  };

  // InteractionButtons Component
  const InteractionButtons = ({
    likes,
    comments,
    views
  }: {
    likes: number;
    comments: number;
    views?: number;
  }) => {
    return (
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <svg
            width="16"
            height="16"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.1165 9.67708C14.1099 8.70375 15.1165 7.53708 15.1165 6.01042C15.1165 5.03796 14.7302 4.10533 14.0426 3.41769C13.355 2.73006 12.4223 2.34375 11.4499 2.34375C10.2765 2.34375 9.44987 2.67708 8.44987 3.67708C7.44987 2.67708 6.6232 2.34375 5.44987 2.34375C4.47741 2.34375 3.54478 2.73006 2.85714 3.41769C2.16951 4.10533 1.7832 5.03796 1.7832 6.01042C1.7832 7.54375 2.7832 8.71042 3.7832 9.67708L8.44987 14.3438L13.1165 9.67708Z"
              fill="#F14336"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-muted-foreground text-xs font-normal">
            {likes}
          </span>
        </button>
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <svg
            width="16"
            height="16"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.12865 13.677C7.40103 14.3297 8.8647 14.5064 10.2559 14.1755C11.6471 13.8445 12.8743 13.0275 13.7165 11.8717C14.5586 10.716 14.9603 9.29742 14.849 7.87173C14.7378 6.44603 14.121 5.10693 13.1099 4.09575C12.0987 3.08456 10.7596 2.46779 9.33387 2.35656C7.90817 2.24534 6.48963 2.64698 5.33386 3.48912C4.17809 4.33125 3.36111 5.55849 3.03013 6.94969C2.69915 8.34089 2.87594 9.80457 3.52865 11.077L2.19531 15.0103L6.12865 13.677Z"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-muted-foreground text-xs font-normal">
            {comments}
          </span>
        </button>
        {views !== undefined && (
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z"
                stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
            </svg>
            <span className="text-muted-foreground text-xs font-normal">
              {views}
            </span>
          </div>
        )}
      </div>
    );
  };

  // LivePreview Component
  const LivePreview = ({ component }: { component: any }) => {
    const renderPreview = () => {
      // If code is a full HTML document, use it directly
      if (
        typeof component.code === "string" &&
        component.code.trim().startsWith("<!DOCTYPE html")
      ) {
        return (
          <iframe
            srcDoc={component.code}
            className="absolute inset-0 w-full h-full"
            style={{
              background: "transparent",
              transform: "scale(0.7)",
              transformOrigin: "center",
            }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // Tailwind preview (language or technology)
      if (
        (component.language &&
          (component.language.toLowerCase() === "tailwind" ||
            component.language.toLowerCase() === "tailwindcss") &&
          (component.code || component.tailwind)) ||
        (component.technology === "tailwind" && component.tailwindCode)
      ) {
        const tailwindHtml =
          component.code || component.tailwind || component.tailwindCode || "";
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
            srcDoc={srcDoc}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ background: "transparent" }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // React preview (language)
      if (
        component.language &&
        component.language.toLowerCase() === "react" &&
        component.code
      ) {
        // Try to render the React code using Babel
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
                  ${component.code}
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
            srcDoc={srcDoc}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ background: "transparent" }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // Multi-language (full HTML doc)
      if (component.language && component.language.toLowerCase() === "multi") {
        // Build srcDoc from separate fields if code field is missing
        const srcDoc =
          component.code ||
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
                ${component.cssCode || ""}
              </style>
            </head>
            <body>
              ${component.htmlCode || ""}
            </body>
          </html>
        `;

        return (
          <iframe
            srcDoc={srcDoc}
            className="absolute inset-0 w-full h-full"
            style={{
              background: "transparent",
              transform: "scale(0.6)",
              transformOrigin: "center",
            }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // CSS + HTML code (language or technology)
      if (
        ((component.language && component.language.toLowerCase() === "css") ||
          component.technology === "css") &&
        component.htmlCode &&
        component.cssCode
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
                  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                  overflow: hidden;
                }
                ${component.cssCode || ""}
              </style>
            </head>
            <body>
              ${component.htmlCode || ""}
            </body>
          </html>
        `;
        return (
          <iframe
            srcDoc={srcDoc}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ background: "transparent" }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // Fallback: HTML, CSS, JS code
      if (component.language && component.code) {
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
                #preview-wrapper {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transform: scale(0.5);
                  transform-origin: center;
                  max-width: 100%;
                  max-height: 100%;
                }
                ${
                  component.language.toLowerCase() === "css"
                    ? component.code
                    : ""
                }
              </style>
            </head>
            <body>
              <div id="preview-wrapper">
                ${
                  component.language.toLowerCase() === "html"
                    ? component.code
                    : ""
                }
              </div>
              <script>${
                component.language.toLowerCase() === "javascript"
                  ? component.code
                  : ""
              }</script>
            </body>
          </html>
        `;
        return (
          <iframe
            srcDoc={srcDoc}
            className="absolute inset-0 w-full h-full"
            style={{ background: "transparent" }}
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        );
      }

      // Fallback to preview video if available
      if (component.preview) {
        return (
          <video
            src={component.preview}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        );
      }

      // No preview available
      return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-500">
          No preview
        </div>
      );
    };

    return renderPreview();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Discover
          <span className="text-primary"> Incredible</span>
          <br />
          Components from Creators
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Browse thousands of production-ready UI components built by talented
          designers and developers from around the world.
        </p>
        <div className="flex gap-4 justify-center max-sm:flex-col max-sm:items-center">
          <Link
            to="/components"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-opacity flex items-center justify-center"
          >
            Browse components
          </Link>
          <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
            <DialogTrigger asChild>
              <button
                className="border border-primary/50 hover:bg-secondary px-8 py-3 rounded-full font-medium transition-colors"
                onClick={() => setPopupOpen(true)}
              >
                Submit yours
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[897px] w-full mx-auto rounded-2xl bg-[rgba(15,15,15,1)] p-0 border-none shadow-none">
              <ComponentSelectorPopup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onContinue={() => setPopupOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & Filters Section */}
      {/* (Removed from here, moved below Featured Components and above All Components) */}

      {/* Featured Components Section */}
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Components</h2>
          <p className="text-muted-foreground">
            Hand-picked components from top creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(components.length > 0
            ? components.slice(0, 4)
            : featuredComponents
          ).map((component, index) => {
            return (
              <Link
                to={`/components/${component.type || "component"}/${
                  component._id || index
                }`}
                key={component._id || index}
              >
                <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="h-64 rounded-t-lg relative overflow-hidden" style={{ backgroundColor: "#9ca3af" }}>
                      <LivePreview component={component} />
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-black/50 text-white backdrop-blur-sm"
                        >
                          {(component.type || component.category)
                            ?.replace(/component/gi, "")
                            .trim()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const userId =
                              component.createdBy?._id ||
                              component.author?._id ||
                              "";
                            if (userId) {
                              window.location.href = `/community/${userId}`;
                            }
                          }}
                          title="View user profile"
                        >
                          <Avatar
                            initials={
                              component.createdBy?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                              component.author?.initials ||
                              "U"
                            }
                            size="sm"
                          />
                          <div>
                            <div className="text-sm font-medium group-hover:underline">
                              {component.createdBy?.name ||
                                component.author?.name ||
                                "Anonymous"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {component.createdBy?.username ||
                                component.author?.username ||
                                ""}
                            </div>
                          </div>
                        </div>
                        <InteractionButtons
                          likes={
                            component.likeCount ||
                            component.likedBy?.length ||
                            0
                          }
                          comments={
                            component.commentCount ||
                            (Array.isArray(component.comments)
                              ? component.comments.length
                              : 0)
                          }
                          views={component.views || 0}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* All Components Section */}
      {/* Search & Filters Section moved here */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg border border-border transition-colors"
              onClick={() => setShowTypeFilter((v) => !v)}
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.7995 2.66675H10.1328"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.46647 2.66675H2.7998"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.7998 8H8.7998"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.13314 8H2.7998"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.8001 13.3333H11.4668"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.7998 13.3333H2.7998"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.1328 1.33325V3.99992"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.13281 6.66675V9.33341"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.4668 12V14.6667"
                  stroke="currentColor"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm">Categories</span>
            </button>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {selectedCategory === "All"
                ? "All Components"
                : selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}
            </Badge>
            {showTypeFilter && (
              <div className="absolute z-20 mt-2 bg-background border border-border rounded-lg shadow-lg p-3 flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                    selectedCategory === "All"
                      ? "bg-primary text-white border-primary"
                      : "bg-secondary text-primary border-border hover:bg-primary/10"
                  }`}
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowTypeFilter(false);
                  }}
                >
                  All
                </button>
                {componentTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                      selectedCategory === type
                        ? "bg-primary text-white border-primary"
                        : "bg-secondary text-primary border-border hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      setSelectedCategory(type);
                      setShowTypeFilter(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2 14L11.3066 11.1067"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.53255 12.6667C10.4781 12.6667 12.8659 10.2789 12.8659 7.33333C12.8659 4.38781 10.4781 2 7.53255 2C4.58703 2 2.19922 4.38781 2.19922 7.33333C2.19922 10.2789 4.58703 12.6667 7.53255 12.6667Z"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">All Components</h2>
          <p className="text-muted-foreground">
            Explore the complete collection of community components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(components.length > 0
            ? [...components]
            : [...featuredComponents, ...allComponents]
          )
            .filter((component) => {
              // Type/category filter
              if (selectedCategory !== "All") {
                const type = (
                  component.type ||
                  component.category ||
                  ""
                ).toLowerCase();
                if (type !== selectedCategory.toLowerCase()) return false;
              }
              // Search filter
              if (searchQuery.trim() !== "") {
                const q = searchQuery.toLowerCase();
                return (
                  (component.title &&
                    component.title.toLowerCase().includes(q)) ||
                  (component.description &&
                    component.description.toLowerCase().includes(q)) ||
                  (component.category &&
                    component.category.toLowerCase().includes(q)) ||
                  (component.type &&
                    component.type.toLowerCase().includes(q)) ||
                  (component.author?.name &&
                    component.author.name.toLowerCase().includes(q)) ||
                  (component.createdBy?.name &&
                    component.createdBy.name.toLowerCase().includes(q))
                );
              }
              return true;
            })
            .map((component, index) => {
              return (
                <Link
                  to={`/components/${component.type || "component"}/${
                    component._id || index
                  }`}
                  key={component._id || index}
                >
                  <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="bg-secondary/50">
                          {(component.type || component.category)
                            ?.replace(/component/gi, "")
                            .trim()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Badge>
                        <InteractionButtons
                          likes={
                            component.likeCount ||
                            component.likedBy?.length ||
                            0
                          }
                          comments={
                            component.commentCount ||
                            (Array.isArray(component.comments)
                              ? component.comments.length
                              : 0)
                          }
                          views={component.views || 0}
                        />
                      </div>

                      <div className="h-96 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#9ca3af" }}>
                        <LivePreview component={component} />
                      </div>

                      <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const userId =
                            component.createdBy?._id ||
                            component.author?._id ||
                            "";
                          if (userId) {
                            window.location.href = `/community/${userId}`;
                          }
                        }}
                        title="View user profile"
                      >
                        <Avatar
                          initials={
                            component.createdBy?.name
                              ?.charAt(0)
                              .toUpperCase() ||
                            component.author?.initials ||
                            "U"
                          }
                          size="sm"
                        />
                        <div>
                          <div className="text-sm font-medium group-hover:underline">
                            {component.createdBy?.name ||
                              component.author?.name ||
                              "Anonymous"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {component.createdBy?.username ||
                              component.author?.username ||
                              ""}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16 bg-gradient-card rounded-2xl border border-border">
        <h2 className="text-3xl font-bold mb-4">Share your creations</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators sharing their best work with the community
        </p>
        <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-opacity"
              onClick={() => setPopupOpen(true)}
            >
              Submit Component
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[897px] w-full mx-auto rounded-2xl bg-[rgba(15,15,15,1)] p-0 border-none shadow-none">
            <ComponentSelectorPopup
              isOpen={popupOpen}
              onClose={() => setPopupOpen(false)}
              onContinue={() => setPopupOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Popup now handled by Dialog above */}
    </div>
  );
};

const CommunityUserProfileRoute = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch user data and their components by userId param
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    // Fetch user info and their components
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`).then((res) =>
        res.json()
      ),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/components?createdBy=${userId}`
      ).then((res) => res.json()),
    ])
      .then(([userInfo, userComponents]) => {
        setUser({
          initials:
            userInfo?.name?.substring(0, 2).toUpperCase() ||
            userInfo?.username?.substring(0, 2).toUpperCase() ||
            "U",
          name: userInfo?.name || userInfo?.username || "Anonymous",
          username: userInfo?.username ? `@${userInfo.username}` : "",
          social: {
            github: userInfo?.github || "",
            twitter: userInfo?.twitter || "",
            website: userInfo?.website || "",
          },
          profilePicture: userInfo?.profilePicture || "",
          stats: {
            posts: Array.isArray(userComponents) ? userComponents.length : 0,
            views: userInfo?.views || 0,
          },
          sharedComponents: Array.isArray(userComponents)
            ? userComponents.map((comp: any) => ({
                id: comp._id || comp.id || "",
                title: comp.title,
                views: comp.views ? String(comp.views) : "0",
                bookmarks: comp.bookmarks ? String(comp.bookmarks) : "0",
                tags: comp.tags || [],
                isPro: comp.isPro,
                isFree: comp.isFree,
                children: (
                  <div className="w-full flex items-center justify-center">
                    <span className="text-white">{comp.title}</span>
                  </div>
                ),
              }))
            : [],
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-lg text-red-500">
        User not found.
        <br />
        <button
          className="mt-4 px-4 py-2 rounded bg-primary text-white"
          onClick={() => navigate("/community")}
        >
          Back to Community
        </button>
      </div>
    );
  }

  return (
    <CommunityUserProfile
      userId={userId}
      goBackHandler={() => navigate("/community")}
    />
  );
};

const Community = () => {
  return (
    <Routes>
      <Route path="/" element={<CommunityList />} />
      <Route path=":userId" element={<CommunityUserProfileRoute />} />
    </Routes>
  );
};

export default Community;
