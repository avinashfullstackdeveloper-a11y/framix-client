import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Heart, ExternalLink, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

type FavouriteComponent = {
  id: string;
  title: string;
  type: string;
  language: string;
  code: string;
  preview?: string;
  createdBy?: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
  };
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  technology?: string;
};

type ComponentPreview = {
  code?: string;
  language?: string;
  technology?: string;
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  preview?: string;
};

// Avatar Component (from Community.tsx)
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

// LivePreview Component (extracted from Community.tsx)
const LivePreview = ({ component }: { component: ComponentPreview }) => {
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
        component.language.toLowerCase() === "tailwind" &&
        component.code) ||
      (component.technology === "tailwind" && component.tailwindCode)
    ) {
      const tailwindHtml = component.code || component.tailwindCode || "";
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
    if (
      component.language &&
      component.language.toLowerCase() === "multi" &&
      component.code
    ) {
      return (
        <iframe
          srcDoc={component.code}
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
                component.language.toLowerCase() === "css" ? component.code : ""
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
        No preview available
      </div>
    );
  };

  return renderPreview();
};

const Favourite: React.FC = () => {
  const [favourites, setFavourites] = useState<FavouriteComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { user } = useAuth();
  const token =
    ("token" in (user ?? {})
      ? (user as { token?: string }).token
      : undefined) ||
    localStorage.getItem("token") ||
    "";

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<
          Array<{
            component: Partial<FavouriteComponent> & {
              _id?: string;
              id?: string;
            };
          }>
        >("/api/favourites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map backend favourites to FavouriteComponent[]
        const mapped: FavouriteComponent[] = Array.isArray(data)
          ? data.map((fav) => {
              const component = fav.component;
              const createdBy = component?.createdBy;
              
              return {
                id: String(component?._id || component?.id || ""),
                title: component?.title || "Untitled",
                type: component?.type || "",
                language: component?.language || "",
                code: component?.code || "",
                preview: component?.preview || "",
                createdBy: createdBy
                  ? {
                      _id: createdBy._id || createdBy.id,
                      id: createdBy.id || createdBy._id,
                      name: createdBy.name,
                      username: createdBy.username,
                    }
                  : undefined,
                htmlCode: component?.htmlCode || "",
                cssCode: component?.cssCode || "",
                tailwindCode: component?.tailwindCode || "",
                technology: component?.technology || "",
              };
            })
          : [];
        setFavourites(mapped);
      } catch (err) {
        setError((err as Error).message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [token]);

  const handleRemoveFavourite = async (componentId: string) => {
    setRemovingId(componentId);
    try {
      const response = await fetch(`/api/favourites/${componentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to remove favourite");
      setFavourites((prev) => prev.filter((f) => f.id !== componentId));
    } catch (err) {
      alert("Error removing favourite");
    } finally {
      setRemovingId(null);
    }
  };

  const getLanguageColor = (language: string) => {
    const lang = language.toLowerCase();
    if (lang === "react")
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (lang === "html")
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (lang === "css")
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (lang === "javascript")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (lang === "multi")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (lang === "tailwind")
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
            <Heart className="w-7 h-7 text-red-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Your Favourite Components
            </h1>
            <p className="text-muted-foreground mt-1">
              {favourites.length}{" "}
              {favourites.length === 1 ? "component" : "components"} saved
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className="bg-gradient-card border-border">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-gradient-card border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Failed to Load Favourites
                </h3>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && favourites.length === 0 && (
          <Card className="bg-gradient-card border-border max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Favourites Yet
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Start exploring components and add them to your favourites to
                see them here.
              </p>
              <button
                onClick={() => (window.location.href = "/components")}
                className="px-6 py-2.5 bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity text-sm font-medium"
              >
                Browse Components
              </button>
            </CardContent>
          </Card>
        )}

        {/* Favourites Grid */}
        {!loading && !error && favourites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favourites.map((component) => (
              <Card
                key={component.id}
                className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-0">
                  {/* Preview Section */}
                  <div className="h-64 rounded-t-lg relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                    <LivePreview component={component} />
                    <div className="absolute top-3 right-3 z-10">
                      <Badge
                        variant="secondary"
                        className={`${getLanguageColor(
                          component.language
                        )} border font-medium text-xs`}
                      >
                        {component.language.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Component Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-secondary/50 text-xs"
                      >
                        {component.type
                          ?.replace(/component/gi, "")
                          .trim()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </Badge>
                    </div>

                    {/* Author Information */}
                    <div
                      className="flex items-center gap-2 mb-3 cursor-pointer group/author"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const userId =
                          component.createdBy?._id || component.createdBy?.id;
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
                            .toUpperCase() || "U"
                        }
                        size="sm"
                      />
                      <div>
                        <div className="text-sm font-medium group-hover/author:underline">
                          {component.createdBy?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {component.createdBy?.username || ""}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          window.location.href = `/components/${component.type}/${component.id}`;
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </button>

                      <button
                        disabled={removingId === component.id}
                        onClick={() => handleRemoveFavourite(component.id)}
                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-red-500/30"
                        title="Remove from favourites"
                      >
                        {removingId === component.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4" fill="currentColor" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
