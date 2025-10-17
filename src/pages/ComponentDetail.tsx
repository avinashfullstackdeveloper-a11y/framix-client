import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from '@monaco-editor/react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

type ComponentData = {
  id: string;
  name: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  html?: string;
  css?: string;
  js?: string;
  react?: string;
};

const ComponentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [component, setComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Favourites state
  const [isFavourited, setIsFavourited] = useState(false);
  const [savingFavourite, setSavingFavourite] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const token =
    ("token" in (user ?? {})
      ? (user as { token?: string }).token
      : undefined) ||
    localStorage.getItem("token") ||
    "";

  useEffect(() => {
    fetch(`/api/components/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setComponent(data);
        setCode(data.code || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  // Check if already favourited
  useEffect(() => {
    if (!id || !user) return;
    fetch(`/api/favourites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favourites");
        return res.json();
      })
      .then((data) => {
        const found =
          Array.isArray(data) &&
          data.some(
            (fav) =>
              fav.component &&
              (fav.component._id === id || fav.component === id)
          );
        setIsFavourited(found);
      })
      .catch(() => setIsFavourited(false));
  }, [id, user, token]);

  // Toggle Favourite handler
  const handleToggleFavourite = async () => {
    if (!id || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage favourites.",
        variant: "destructive",
      });
      return;
    }
    setSavingFavourite(true);
    try {
      if (!isFavourited) {
        const res = await fetch("/api/favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ component: id }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to save favourite");
        }
        setIsFavourited(true);
        toast({
          title: "Saved!",
          description: "Component added to your favourites.",
          variant: "default",
        });
      } else {
        const res = await fetch(`/api/favourites/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to remove favourite");
        }
        setIsFavourited(false);
        toast({
          title: "Removed!",
          description: "Component removed from your favourites.",
          variant: "default",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Could not update favourite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingFavourite(false);
    }
  };

  const getLanguageForEditor = () => {
    const lang = component?.language?.toLowerCase();
    if (lang === "react") return "javascript";
    if (lang === "multi") return "html";
    if (lang === "javascript") return "javascript";
    if (lang === "html") return "html";
    if (lang === "css") return "css";
    return "text";
  };

  const renderPreview = () => {
    if (!component?.code || !component?.language) {
      return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">👁️</div>
            <p>No preview available</p>
          </div>
        </div>
      );
    }

    const lang = component.language.toLowerCase();

    if (lang === "react") {
      const reactPreviewHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
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
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                overflow: hidden;
              }
              #root {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${code}
              ReactDOM.render(React.createElement(${component.name.replace(/\s+/g, '') || 'Component'}), document.getElementById('root'));
            </script>
          </body>
        </html>
      `;

      return (
        <iframe
          srcDoc={reactPreviewHTML}
          className="w-full h-full border-0"
          style={{ background: 'transparent' }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    if (lang === "multi") {
      return (
        <iframe
          srcDoc={component.code}
          className="w-full h-full border-0"
          style={{ background: 'transparent' }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

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
            ${lang === "css" ? code : ""}
          </style>
        </head>
        <body>
          ${lang === "html" ? code : `<div>${code}</div>`}
          <script>${lang === "javascript" ? code : ""}</script>
        </body>
      </html>
    `;

    return (
      <iframe
        srcDoc={srcDoc}
        className="w-full h-full border-0"
        style={{ background: 'transparent' }}
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading component...</p>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Component not found</h2>
          <p className="text-gray-600">
            The component you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {component.language}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{component.name}</h1>
          {component.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {component.description}
            </p>
          )}
          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {component.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
              <h3 className="font-semibold">Preview</h3>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-neutral-950 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {renderPreview()}
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
              <h3 className="font-semibold">
                {component.name}.{getLanguageForEditor()}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast({
                      title: "Copied!",
                      description: "Code copied to clipboard.",
                      variant: "default",
                    });
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageForEditor()}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  readOnly: !isEditing,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  lineDecorationsWidth: 1,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Button
            variant="default"
            disabled={savingFavourite}
            onClick={handleToggleFavourite}
          >
            {savingFavourite
              ? "Saving..."
              : isFavourited
              ? "Unfavourite"
              : "Save to Favourite"}
          </Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;