import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { LiveProvider, LivePreview, LiveError } from "react-live";

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
  const { user } = useAuth();
  const token =
    ("token" in (user ?? {}) ? (user as { token?: string }).token : undefined) ||
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Favourite Components</h1>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full" />
          ))}
        </div>
      )}
      {error && (
        <div className="text-red-500 font-semibold mt-4">
          Error: {error}
        </div>
      )}
      {!loading && !error && favourites.length === 0 && (
        <div className="mt-4 text-gray-500">No favourites found.</div>
      )}
      {!loading && !error && favourites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favourites.map((component) => (
            <Card key={component.id} className="p-4 flex flex-col">
              <div className="mb-4 text-xl font-semibold">{component.title}</div>
              <div className="mb-2 text-sm text-muted-foreground">{component.type}</div>
              {/* Preview based on code and language */}
              {component.language && component.code && (
                component.language.toLowerCase() === "react" ? (
                  <div className="w-full aspect-square flex items-center justify-center bg-neutral-900 rounded-lg overflow-auto">
                    <LiveProvider code={component.code}>
                      <LivePreview />
                      <LiveError className="live-error" />
                    </LiveProvider>
                  </div>
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
                            ${component.language.toLowerCase() === "css" ? component.code : ""}
                          </style>
                        </head>
                        <body>
                          ${component.language.toLowerCase() === "html" ? component.code : ""}
                          <script>${component.language.toLowerCase() === "javascript" ? component.code : ""}</script>
                        </body>
                      </html>`}
                    className="w-full aspect-square min-h-[6rem] rounded-lg border overflow-auto"
                  />
                )
              )}
              <button
                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => {
                  // Navigate to ComponentDetail page for this component
                  window.location.href = `/components/${component.type}/${component.id}`;
                }}
              >
                View Details
              </button>
              <button
                className={`mt-2 px-3 py-1 rounded transition ${
                  favourites.some(f => f.id === component.id)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                disabled={loading}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    if (favourites.some(f => f.id === component.id)) {
                      const response = await fetch(`/api/favourites/${component.id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      if (!response.ok) throw new Error("Failed to remove favourite");
                      setFavourites(prev => prev.filter(f => f.id !== component.id));
                    } else {
                      const response = await fetch("/api/favourites", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ component: component.id }),
                      });
                      if (!response.ok) throw new Error("Failed to add favourite");
                      setFavourites(prev => [...prev, component]);
                    }
                  } catch (err) {
                    alert("Error updating favourite");
                  }
                }}
              >
                {favourites.some(f => f.id === component.id) ? "Unfavourite" : "Favourite"}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourite;