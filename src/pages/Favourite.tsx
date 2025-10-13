import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Heart, ExternalLink, Eye, Trash2 } from "lucide-react";

type FavouriteComponent = {
  id: string;
  title: string;
  type: string;
  language: string;
  code: string;
  preview?: string;
  createdBy?: string;
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
        const response = await fetch("/api/favourites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch favourites");
        }
        const data = await response.json();
        // Map backend favourites to FavouriteComponent[]
        const mapped = Array.isArray(data)
          ? data.map((fav: any) => ({
              id: fav.component?._id || fav.component?.id || fav.component,
              title: fav.component?.title || "Untitled",
              type: fav.component?.type || "",
              language: fav.component?.language || "",
              code: fav.component?.code || "",
              preview: fav.component?.preview || "",
              createdBy: fav.component?.createdBy || "",
            }))
          : [];
        setFavourites(mapped);
      } catch (err: any) {
        setError(err.message || "Unknown error");
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
    if (lang === "react") return "text-blue-500";
    if (lang === "html") return "text-orange-500";
    if (lang === "css") return "text-purple-500";
    if (lang === "javascript") return "text-yellow-500";
    if (lang === "multi") return "text-green-500";
    return "text-gray-500";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 rounded-lg">
          <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Your Favourite Components
          </h1>
          <p className="text-gray-100 mt-1">
            {favourites.length}{" "}
            {favourites.length === 1 ? "component" : "components"} saved
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Failed to Load Favourites
            </h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && favourites.length === 0 && (
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Favourites Yet
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Start exploring components and add them to your favourites to see
            them here.
          </p>
          <button
            onClick={() => (window.location.href = "/components")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Browse Components
          </button>
        </Card>
      )}

      {/* Favourites Grid */}
      {!loading && !error && favourites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favourites.map((component) => (
            <Card
              key={component.id}
              className="p-4 flex flex-col group hover:shadow-lg transition-shadow"
            >
              {/* Component Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-lg mb-1">
                    {component.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${getLanguageColor(
                        component.language
                      )}`}
                    >
                      {component.language.toUpperCase()}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600 capitalize">
                      {component.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="mb-4 relative">
                <div className="w-full aspect-square flex items-center justify-center bg-neutral-900 rounded-lg overflow-auto relative group">
                  {component.language &&
                    component.code &&
                    (component.language.toLowerCase() === "react" ? (
                      <LiveProvider code={component.code}>
                        <LivePreview />
                        <LiveError className="live-error" />
                      </LiveProvider>
                    ) : component.language.toLowerCase() === "multi" ? (
                      <iframe
                        title="Preview"
                        srcDoc={component.code}
                        className="w-full aspect-square min-h-[6rem] rounded-lg border overflow-auto"
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
                                  component.language.toLowerCase() === "css"
                                    ? component.code
                                    : ""
                                }
                              </style>
                            </head>
                            <body>
                              ${
                                component.language.toLowerCase() === "html"
                                  ? component.code
                                  : ""
                              }
                              <script>${
                                component.language.toLowerCase() ===
                                "javascript"
                                  ? component.code
                                  : ""
                              }</script>
                            </body>
                          </html>`}
                        className="w-full aspect-square min-h-[6rem] rounded-lg border overflow-auto"
                      />
                    ))}

                  {/* Hover Overlay */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => {
                    window.location.href = `/components/${component.type}/${component.id}`;
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </button>

                <button
                  disabled={removingId === component.id}
                  onClick={() => handleRemoveFavourite(component.id)}
                  className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Remove from favourites"
                >
                  {removingId === component.id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4" fill="currentColor" />
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourite;
