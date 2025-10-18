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
  // Multi-tab code states
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");
  const [reactCode, setReactCode] = useState<string>("");
  // Dynamically track available code tabs
  const [availableTabs, setAvailableTabs] = useState<Array<"html" | "css" | "tailwind" | "react">>([]);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "tailwind" | "react">("html");
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
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        setComponent(data);

        let htmlValue = "";
        let cssValue = "";
        let tailwindValue = "";
        let reactValue = "";

        if (data.html !== undefined) htmlValue = data.html;
        if (data.css !== undefined) cssValue = data.css;
        if (data.tailwind !== undefined) tailwindValue = data.tailwind;
        if (data.react !== undefined) reactValue = data.react;

        if (htmlValue === "" && (data.language === "html" || data.language === "multi")) htmlValue = data.code || "";
        if (cssValue === "" && data.language === "css") cssValue = data.code || "";
        if (tailwindValue === "" && data.language === "tailwind") tailwindValue = data.code || "";
        if (reactValue === "" && (data.language === "react" || data.language === "jsx")) reactValue = data.code || "";

        if (data.language === "multi" && data.code) htmlValue = data.code;
        if (data.language === "html" && data.code && htmlValue === "") htmlValue = data.code;

        if (!data.html && !data.css && !data.tailwind && !data.react && data.code && data.language) {
          if (data.language === "html" || data.language === "multi") htmlValue = data.code;
          else if (data.language === "css") cssValue = data.code;
          else if (data.language === "tailwind") tailwindValue = data.code;
          else if (data.language === "react" || data.language === "jsx") reactValue = data.code;
        }

        setHtmlCode(htmlValue);
        setCssCode(cssValue);
        setTailwindCode(tailwindValue);
        setReactCode(reactValue);

        // Dynamically determine available tabs
        const tabs: Array<"html" | "css" | "tailwind" | "react"> = [];
        if (htmlValue) tabs.push("html");
        if (cssValue) tabs.push("css");
        if (tailwindValue) tabs.push("tailwind");
        if (reactValue) tabs.push("react");
        setAvailableTabs(tabs);
        // Set initial active tab to first available
        if (tabs.length > 0) setActiveTab(tabs[0]);

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
      credentials: "include",
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
          credentials: "include",
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
          credentials: "include",
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

  // Editor language for Monaco
  const getLanguageForEditor = () => {
    if (activeTab === "html") return "html";
    if (activeTab === "css") return "css";
    if (activeTab === "tailwind") return "javascript";
    if (activeTab === "react") return "javascript";
    return "text";
  };

  // Preview logic based on active tab
  const renderPreview = () => {
    if (activeTab === "html") {
      if (!htmlCode) return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">👁️</div>
            <p>No preview available</p>
          </div>
        </div>
      );
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
            </style>
          </head>
          <body>
            ${htmlCode}
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
    }
    if (activeTab === "css") {
      if (!cssCode) return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">👁️</div>
            <p>No preview available</p>
          </div>
        </div>
      );
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
              ${cssCode}
            </style>
          </head>
          <body>
            <div>CSS Preview</div>
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
    }
    if (activeTab === "tailwind") {
      if (!tailwindCode) return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">👁️</div>
            <p>No preview available</p>
          </div>
        </div>
      );
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
            ${tailwindCode}
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
    }
    if (activeTab === "react") {
      if (!reactCode) return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">👁️</div>
            <p>No preview available</p>
          </div>
        </div>
      );
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
              ${reactCode}
              ReactDOM.render(React.createElement(${component?.name?.replace(/\s+/g, '') || 'Component'}), document.getElementById('root'));
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
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">👁️</div>
          <p>No preview available</p>
        </div>
      </div>
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

          {/* Creator Information */}
          {component.createdBy && (
            <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-muted rounded-lg max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold">
                {component.createdBy.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">{component.createdBy.name || 'Anonymous'}</div>
                <div className="text-sm text-muted-foreground">{component.createdBy.email || ''}</div>
                {component.creatorStatus && (
                  <div className="text-xs text-primary mt-1">
                    {component.creatorStatus === 'original' && '✓ Original Creator'}
                    {component.creatorStatus === 'found' && 'Found & Shared'}
                    {component.creatorStatus === 'modified' && 'Found & Modified'}
                  </div>
                )}
              </div>
            </div>
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
                    let codeToCopy = "";
                    if (activeTab === "html") codeToCopy = htmlCode;
                    else if (activeTab === "css") codeToCopy = cssCode;
                    else if (activeTab === "tailwind") codeToCopy = tailwindCode;
                    else if (activeTab === "react") codeToCopy = reactCode;
                    navigator.clipboard.writeText(codeToCopy);
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
            <div className="flex border-b bg-muted/50">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium ${activeTab === tab ? "bg-background text-purple-700 border-b-2 border-purple-700" : "text-gray-500"}`}
                  onClick={() => {
                    console.log(`Tab switch: ${tab}`);
                    setActiveTab(tab);
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageForEditor()}
                value={
                  activeTab === "html"
                    ? htmlCode
                    : activeTab === "css"
                    ? cssCode
                    : activeTab === "tailwind"
                    ? tailwindCode
                    : reactCode
                }
                onChange={(value) => {
                  // Persist code for each tab independently, only update if value is not undefined
                  if (activeTab === "html" && value !== undefined) {
                    setHtmlCode(value);
                    console.log("setHtmlCode (Editor):", value);
                  } else if (activeTab === "css" && value !== undefined) {
                    setCssCode(value);
                    console.log("setCssCode (Editor):", value);
                  } else if (activeTab === "tailwind" && value !== undefined) {
                    setTailwindCode(value);
                    console.log("setTailwindCode (Editor):", value);
                  } else if (activeTab === "react" && value !== undefined) {
                    setReactCode(value);
                    console.log("setReactCode (Editor):", value);
                  }
                }}
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