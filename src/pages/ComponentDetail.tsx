import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { trackComponentView } from "@/lib/api";
import { FigmaButton } from "../components/ui/FigmaButton";
import {
  Avatar as ShadAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  tailwind?: string;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  creatorStatus?: "original" | "found" | "modified";
};

// Helper function to determine if color is light or dark
const isLightColor = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

// Preset colors for the palette
const presetColors = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f9fafb" },
  { name: "Dark Gray", value: "#1f2937" },
  { name: "Black", value: "#0a0a0a" },
  { name: "Light Blue", value: "#dbeafe" },
  { name: "Blue", value: "#1e40af" },
  { name: "Light Purple", value: "#f3e8ff" },
  { name: "Purple", value: "#6b21a8" },
  { name: "Light Green", value: "#d1fae5" },
  { name: "Green", value: "#065f46" },
];

const ComponentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [component, setComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [technology, setTechnology] = useState<"css" | "tailwind">("css");
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [previewHtmlCode, setPreviewHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [isEditing] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState<string>("#e9edeb");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Favourites state
  const [isFavourited, setIsFavourited] = useState(false);
  const [savingFavourite, setSavingFavourite] = useState(false);

  // Likes/comments state
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [comments, setComments] = useState<
    {
      _id: string;
      text: string;
      user?: { name?: string; _id?: string; avatar?: string };
      replies?: {
        _id: string;
        text: string;
        user?: { name?: string; _id?: string; avatar?: string };
        timestamp?: string;
      }[];
      timestamp?: string;
    }[]
  >([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  const { toast } = useToast();
  const { user } = useAuth();
  const token =
    ("token" in (user ?? {})
      ? (user as { token?: string }).token
      : undefined) ||
    localStorage.getItem("token") ||
    "";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/components/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setComponent(data);

        // Determine technology type
        let tech: "css" | "tailwind" = "css";
        if (data.language === "tailwind" || data.tailwind) tech = "tailwind";
        setTechnology(tech);

        if (tech === "css") {
          let htmlValue = "";
          let cssValue = "";

          // Priority 1: Check for separate html/css fields (new format from admin upload)
          if (data.html !== undefined && data.html !== null) {
            htmlValue = data.html;
          }
          if (data.css !== undefined && data.css !== null) {
            cssValue = data.css;
          }

          // Priority 2: Check for legacy htmlCode/cssCode fields
          if (!htmlValue && data.htmlCode !== undefined) {
            htmlValue = data.htmlCode;
          }
          if (!cssValue && data.cssCode !== undefined) {
            cssValue = data.cssCode;
          }

          // Priority 3: Fallback to combined 'code' field only if no separate fields exist
          if (!htmlValue && !cssValue && data.code) {
            if (data.language === "html" || data.language === "multi") {
              htmlValue = data.code;
            } else if (data.language === "css") {
              cssValue = data.code;
            }
          }

          setHtmlCode(htmlValue);
          setCssCode(cssValue);
          setPreviewHtmlCode(htmlValue);
          setActiveTab("html");
        } else if (tech === "tailwind") {
          let tailwindValue = "";
          if (data.tailwindCode !== undefined)
            tailwindValue = data.tailwindCode;
          else if (data.tailwind !== undefined) tailwindValue = data.tailwind;
          if (!tailwindValue && data.code && data.language === "tailwind")
            tailwindValue = data.code;
          setTailwindCode(tailwindValue);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  // Track component view on mount (with ref to prevent double-counting in StrictMode)
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (id && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackComponentView(id).catch((err) =>
        console.error("Failed to track view:", err)
      );
    }
  }, [id]);

  // Fetch likes and comments on mount
  useEffect(() => {
    if (!id) return;
    // Likes
    setLikeLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/components/${id}/like`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLikesCount(data.count || 0);
        setLikedByMe(!!data.likedByMe);
      })
      .catch(() => {})
      .finally(() => setLikeLoading(false));
    // Comments
    setCommentsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/components/${id}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(
          Array.isArray(data.comments)
            ? data.comments
            : Array.isArray(data)
            ? data
            : []
        );
      })
      .catch((err) => {
        console.error("[Comments] Error fetching:", err);
      })
      .finally(() => setCommentsLoading(false));
  }, [id, token]);

  // Check if already favourited
  useEffect(() => {
    if (!id || !user) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/favourites`, {
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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favourites`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ component: id }),
          }
        );
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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favourites/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
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
    if (technology === "css") return activeTab;
    if (technology === "tailwind") return "javascript";
    return "html";
  };

  // Preview logic with custom background color
  const renderPreview = () => {
    const textColor = isLightColor(backgroundColor) ? "#1f2937" : "#f3f4f6";

    if (technology === "css") {
      if (!htmlCode && !cssCode) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      const hasHtml = htmlCode && htmlCode.trim() !== "";
      const hasCss = cssCode && cssCode.trim() !== "";
      if (!hasHtml) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      const srcDoc = `
        <!DOCTYPE html>
        <html style="background: ${backgroundColor}; color: ${textColor};">
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
                background: ${backgroundColor};
                color: ${textColor};
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                overflow: hidden;
              }
              ${hasCss ? cssCode : ""}
            </style>
          </head>
          <body>
            ${previewHtmlCode}
          </body>
        </html>
      `;
      return (
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          style={{ background: "transparent" }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    if (technology === "tailwind") {
      if (!tailwindCode) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      const srcDoc = `
          <!DOCTYPE html>
          <html style="background: ${backgroundColor}; color: ${textColor};">
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
                  background: ${backgroundColor};
                  color: ${textColor};
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
          style={{ background: "transparent" }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <div className="text-center text-muted-foreground">
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
          <p className="text-muted-foreground">
            The component you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Creator Profile Card at Top */}
        {component.createdBy && (
          <Card
            className="max-w-2xl mx-auto mb-8 mt-0 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            onClick={() => {
              if (component.createdBy?._id) {
                navigate(`/community/user/${component.createdBy._id}`);
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {component.createdBy.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-lg group-hover:text-primary transition-colors">
                      {component.createdBy.name || "Anonymous"}
                    </div>
                    {component.creatorStatus && (
                      <Badge variant="secondary" className="text-xs">
                        {component.creatorStatus === "original" &&
                          "✓ Original Creator"}
                        {component.creatorStatus === "found" &&
                          "Found & Shared"}
                        {component.creatorStatus === "modified" &&
                          "Found & Modified"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {component.createdBy.email || ""}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="text-sm font-medium hidden sm:inline">
                    View Profile
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm font-medium">
              {component.language}
            </Badge>
          </div>
        </div>

        {/* Component Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{component.name}</h1>
          {component.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {component.description}
            </p>
          )}

          {/* Creator Information (moved above, now removed here) */}
          {/* (was here) */}

          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {component.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Preview Panel */}
          <Card className="overflow-hidden bg-white border-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-end">
                <Popover
                  open={showColorPicker}
                  onOpenChange={setShowColorPicker}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor }}
                      />
                      <span className="ml-2">{backgroundColor}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Preset Colors
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {presetColors.map((color) => (
                            <button
                              key={color.value}
                              className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                              style={{
                                backgroundColor: color.value,
                                borderColor:
                                  backgroundColor === color.value
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--border))",
                              }}
                              onClick={() => {
                                setBackgroundColor(color.value);
                                setShowColorPicker(false);
                              }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Custom Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="rounded border cursor-pointer w-12 h-10"
                          />
                          <Input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] flex items-center justify-center bg-gray-300">
                {renderPreview()}
              </div>
            </CardContent>
          </Card>

          {/* Code Panel */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {component.name}.{getLanguageForEditor()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="copy-btn-pink-hover"
                    onClick={() => {
                      let codeToCopy = "";
                      if (technology === "css") {
                        codeToCopy = activeTab === "html" ? htmlCode : cssCode;
                      } else if (technology === "tailwind") {
                        codeToCopy = tailwindCode;
                      }
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
                  {/* Edit button removed: editor is always editable */}
                  <FigmaButton
                    onClick={() => {
                      let codeToCopy = "";
                      if (technology === "css") {
                        codeToCopy = activeTab === "html" ? htmlCode : cssCode;
                      } else if (technology === "tailwind") {
                        codeToCopy = tailwindCode;
                      }
                      navigator.clipboard.writeText(codeToCopy);
                      toast({
                        title: "Copied to Figma!",
                        description: "Code copied for Figma.",
                        variant: "default",
                      });
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {technology === "css" && (
                <Tabs
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as "html" | "css")
                  }
                >
                  <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              <div className="h-[500px]">
                {technology === "css" ? (
                  <Editor
                    key={activeTab}
                    height="100%"
                    language={getLanguageForEditor()}
                    value={activeTab === "html" ? htmlCode : cssCode}
                    onChange={(value) => {
                      if (activeTab === "html") setHtmlCode(value || "");
                      else setCssCode(value || "");
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      readOnly: !isEditing,
                      wordWrap: "on",
                      lineNumbers: "on",
                      folding: true,
                      lineDecorationsWidth: 1,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                ) : (
                  <Editor
                    height="100%"
                    language={getLanguageForEditor()}
                    value={tailwindCode}
                    onChange={(value) => setTailwindCode(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      readOnly: !isEditing,
                      wordWrap: "on",
                      lineNumbers: "on",
                      folding: true,
                      lineDecorationsWidth: 1,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Likes */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={likedByMe ? "default" : "outline"}
                    size="sm"
                    disabled={likeLoading}
                    onClick={async () => {
                      setLikeLoading(true);
                      try {
                        const method = likedByMe ? "DELETE" : "POST";
                        const url = `${
                          import.meta.env.VITE_API_URL
                        }/api/components/${id}/like`;
                        const res = await fetch(url, {
                          method,
                          headers: { Authorization: `Bearer ${token}` },
                          credentials: "include",
                        });
                        if (!res.ok) throw new Error("Failed to update like");
                        setLikedByMe(!likedByMe);
                        setLikesCount((prev) =>
                          likedByMe ? prev - 1 : prev + 1
                        );
                      } catch (err) {
                        console.error("[Like] Error:", err);
                        toast({
                          title: "Error",
                          description: "Could not update like.",
                          variant: "destructive",
                        });
                      } finally {
                        setLikeLoading(false);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    {likeLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : likedByMe ? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91 0.81 10 2.09 11.09 0.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5 20 9.28 16.6 12.36 11.45 17.04L10 18.35Z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    {likeLoading ? "Processing" : likedByMe ? "Liked" : "Like"}
                  </Button>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{likesCount}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                </div>

                {/* Comments Count */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{comments.length}</div>
                    <div className="text-xs text-muted-foreground">
                      Comments
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={isFavourited ? "default" : "outline"}
                  disabled={savingFavourite}
                  onClick={handleToggleFavourite}
                  className="flex items-center gap-2"
                >
                  {savingFavourite ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isFavourited ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  )}
                  {savingFavourite
                    ? "Saving..."
                    : isFavourited
                    ? "Favourited"
                    : "Add to Favourites"}
                </Button>

                <Button variant="outline" className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Discussion ({comments.length})
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Share your thoughts and feedback about this component
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Comment Input */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commentsLoading}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      commentText.length > 500
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {commentText.length}/500
                  </span>
                  <Button
                    onClick={async () => {
                      if (!commentText.trim()) return;
                      setCommentsLoading(true);
                      try {
                        const res = await fetch(
                          `${
                            import.meta.env.VITE_API_URL
                          }/api/components/${id}/comments`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            credentials: "include",
                            body: JSON.stringify({ text: commentText }),
                          }
                        );
                        if (!res.ok) throw new Error("Failed to post comment");
                        const response = await res.json();
                        if (response.success && response.comments) {
                          setComments(response.comments);
                        }
                        setCommentText("");
                      } catch (err) {
                        console.error("[Comment] Error:", err);
                        toast({
                          title: "Error",
                          description: "Could not post comment.",
                          variant: "destructive",
                        });
                      } finally {
                        setCommentsLoading(false);
                      }
                    }}
                    disabled={
                      commentsLoading ||
                      !commentText.trim() ||
                      commentText.length > 500
                    }
                  >
                    {commentsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-muted-foreground mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-muted-foreground">No comments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                  >
                    {/* Avatar for comment user */}
                    {(() => {
                      const initials =
                        comment.user?.name?.charAt(0).toUpperCase() || "U";
                      const avatarUrl = comment.user?.avatar;
                      return (
                        <ShadAvatar className="w-10 h-10 rounded-full bg-muted text-foreground font-semibold text-sm flex-shrink-0">
                          {typeof avatarUrl === "string" && avatarUrl ? (
                            <AvatarImage
                              key={avatarUrl}
                              src={avatarUrl}
                              alt={initials}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />
                          ) : null}
                          <AvatarFallback>{initials}</AvatarFallback>
                        </ShadAvatar>
                      );
                    })()}

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {comment.user?.name || "Anonymous User"}
                          </span>
                          {comment.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {user && comment.user?._id === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingCommentId(comment._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>

                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.text}
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
                          onClick={() => {
                            if (replyingTo === comment._id) {
                              setReplyingTo(null);
                              setReplyText("");
                            } else {
                              setReplyingTo(comment._id);
                              setReplyText("");
                            }
                          }}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                          </svg>
                          {replyingTo === comment._id ? "Cancel" : "Reply"}
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment._id && (
                        <div className="flex gap-3 pt-2">
                          {/* Avatar for reply user (current user) */}
                          {(() => {
                            const initials =
                              user?.name?.charAt(0).toUpperCase() || "U";
                            const avatarUrl = user?.avatar;
                            return (
                              <ShadAvatar className="w-8 h-8 rounded-full bg-muted text-foreground font-semibold text-xs flex-shrink-0">
                                {typeof avatarUrl === "string" && avatarUrl ? (
                                  <AvatarImage
                                    key={avatarUrl}
                                    src={avatarUrl}
                                    alt={initials}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : null}
                                <AvatarFallback>{initials}</AvatarFallback>
                              </ShadAvatar>
                            );
                          })()}
                          <div className="flex-1 space-y-2">
                            <Input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              disabled={commentsLoading}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  if (!replyText.trim()) return;
                                  setCommentsLoading(true);
                                  try {
                                    const res = await fetch(
                                      `${
                                        import.meta.env.VITE_API_URL
                                      }/api/components/${id}/comments/${
                                        comment._id
                                      }/reply`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${token}`,
                                        },
                                        credentials: "include",
                                        body: JSON.stringify({
                                          text: replyText,
                                        }),
                                      }
                                    );
                                    if (!res.ok)
                                      throw new Error("Failed to post reply");
                                    const response = await res.json();
                                    if (response.success && response.comments) {
                                      setComments(response.comments);
                                    }
                                    setReplyText("");
                                    setReplyingTo(null);
                                  } catch (err) {
                                    console.error("[Reply] Error:", err);
                                    toast({
                                      title: "Error",
                                      description: "Could not post reply.",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setCommentsLoading(false);
                                  }
                                }}
                                disabled={commentsLoading || !replyText.trim()}
                              >
                                {commentsLoading ? "..." : "Reply"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies List */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-4 border-l-2 border-border pl-4 ml-2 mt-4">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex gap-3">
                              {/* Avatar for reply author */}
                              {(() => {
                                const initials =
                                  reply.user?.name?.charAt(0).toUpperCase() ||
                                  "U";
                                const avatarUrl = reply.user?.avatar;
                                return (
                                  <ShadAvatar className="w-8 h-8 rounded-full bg-muted text-foreground font-semibold text-xs flex-shrink-0">
                                    {typeof avatarUrl === "string" &&
                                    avatarUrl ? (
                                      <AvatarImage
                                        key={avatarUrl}
                                        src={avatarUrl}
                                        alt={initials}
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : null}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </ShadAvatar>
                                );
                              })()}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {reply.user?.name || "Anonymous User"}
                                  </span>
                                  {reply.timestamp && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(
                                        reply.timestamp
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {reply.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCommentId}
        onOpenChange={(open) => !open && setDeletingCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your comment and all its replies.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deletingCommentId) return;
                setCommentsLoading(true);
                try {
                  const res = await fetch(
                    `${
                      import.meta.env.VITE_API_URL
                    }/api/components/${id}/comments/${deletingCommentId}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      credentials: "include",
                    }
                  );

                  if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(
                      errorData.error || "Failed to delete comment"
                    );
                  }

                  const response = await res.json();

                  if (response.success && response.comments) {
                    setComments(response.comments);
                    toast({
                      title: "Comment deleted",
                      description:
                        "Your comment has been successfully deleted.",
                      variant: "default",
                    });
                  }
                } catch (err) {
                  console.error("[Delete Comment] Error:", err);
                  toast({
                    title: "Error",
                    description:
                      err instanceof Error
                        ? err.message
                        : "Could not delete comment.",
                    variant: "destructive",
                  });
                } finally {
                  setCommentsLoading(false);
                  setDeletingCommentId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComponentDetail;
