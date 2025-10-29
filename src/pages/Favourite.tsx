import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Heart, ExternalLink, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateColorFromString, getContrastTextColor } from "@/lib/utils";
import ComponentShowcaseCard from "@/components/ComponentShowcaseCard";

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
    avatar?: string;
    profilePicture?: string;
    picture?: string;
    image?: string;
  };
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  technology?: string;
  likeCount?: number;
  likedBy?: string[];
  commentCount?: number;
  comments?: Array<{ id: string; text: string }>;
  views?: number;
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

// Avatar Component (matching Community.tsx)
const Avatar = ({
  initials,
  size = "sm",
  className = "",
  src,
  identifier,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  src?: string;
  identifier?: string;
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Generate dynamic colors based on identifier
  const bgColor = generateColorFromString(identifier || initials);
  const textColor = getContrastTextColor(bgColor);

  return (
    <ShadAvatar className={`${sizeClasses[size]} border border-neutral-700 ${className}`}>
      {typeof src === "string" && src ? (
        <AvatarImage key={src} src={src} alt={initials} crossOrigin="anonymous" referrerPolicy="no-referrer" />
      ) : null}
      <AvatarFallback
        className="font-medium"
        style={{
          backgroundColor: bgColor,
          color: textColor
        }}
      >
        {initials}
      </AvatarFallback>
    </ShadAvatar>
  );
};

// InteractionButtons Component (from Community.tsx)
const InteractionButtons = ({
  likes,
  comments,
  views,
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          </svg>
          <span className="text-muted-foreground text-xs font-normal">
            {views}
          </span>
        </div>
      )}
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
                      avatar: createdBy.profilePicture || createdBy.avatar || "",
                    }
                  : undefined,
                htmlCode: component?.htmlCode || "",
                cssCode: component?.cssCode || "",
                tailwindCode: component?.tailwindCode || "",
                technology: component?.technology || "",
                likeCount: component?.likeCount || 0,
                likedBy: component?.likedBy || [],
                commentCount: component?.commentCount || 0,
                comments: component?.comments || [],
                views: component?.views || 0,
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
            {favourites.map((component) => {
              // Debug log: show the raw component and mapped props
              // eslint-disable-next-line no-console
              console.log("Favourite raw:", component);
              // eslint-disable-next-line no-console
              console.log("Mapped for card:", {
                _id: component.id,
                title: component.title,
                type: component.type,
                code: component.code,
                language: component.language,
                htmlCode: component.htmlCode,
                cssCode: component.cssCode,
                tailwind: component.tailwindCode,
                views: component.views,
              });
              return (
                <div key={component.id} className="relative">
                  <ComponentShowcaseCard
                    componentItem={{
                      _id: component.id,
                      title: component.title,
                      type: component.type,
                      code: component.code,
                      language: component.language,
                      htmlCode: component.htmlCode,
                      cssCode: component.cssCode,
                      tailwind: component.tailwindCode,
                      views: component.views,
                    }}
                    onClick={() => {
                      window.location.href = `/components/${component.type}/${component.id}`;
                    }}
                  />
                  {/* Remove from Favourites Button */}
                  <button
                    disabled={removingId === component.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFavourite(component.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-red-500/30 flex-shrink-0"
                    title="Remove from favourites"
                  >
                    {removingId === component.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4" fill="currentColor" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
