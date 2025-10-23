import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
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
  tailwind?: string;
  createdBy?: {
    name?: string;
    email?: string;
  };
  creatorStatus?: "original" | "found" | "modified";
};

const ComponentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [component, setComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  /** --- Refactored: Use technology and tabs logic like ComponentEditor --- */
  const [technology, setTechnology] = useState<"css" | "tailwind">("css");
  const [htmlCode, setHtmlCode] = useState<string>("");
  // Store the last non-empty HTML code for preview
  const [previewHtmlCode, setPreviewHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [isEditing, setIsEditing] = useState(false);

  // Favourites state
  const [isFavourited, setIsFavourited] = useState(false);
  const [savingFavourite, setSavingFavourite] = useState(false);

  // Likes/comments state
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [comments, setComments] = useState<{_id: string; text: string; user?: {name?: string}}[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

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
        setComponent(data);

        // Determine technology type
        let tech: "css" | "tailwind" = "css";
        if (data.language === "tailwind" || data.tailwind) tech = "tailwind";
        setTechnology(tech);

        if (tech === "css") {
          // Prefer htmlCode/cssCode fields if present (like in DB)
          let htmlValue = "";
          let cssValue = "";
          if (data.htmlCode !== undefined) htmlValue = data.htmlCode;
          else if (data.html !== undefined) htmlValue = data.html;
          if (data.cssCode !== undefined) cssValue = data.cssCode;
          else if (data.css !== undefined) cssValue = data.css;
          if (
            !htmlValue &&
            data.code &&
            (data.language === "html" ||
              data.language === "multi" ||
              data.language === "css")
          )
            htmlValue = data.code;
          if (!cssValue && data.code && data.language === "css")
            cssValue = data.code;
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

  // Fetch likes and comments on mount
  useEffect(() => {
    if (!id) return;
    // Likes
    setLikeLoading(true);
    fetch(`/api/components/${id}/like`, {
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
    fetch(`/api/components/${id}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
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

  /** Editor language for Monaco (like ComponentEditor) */
  const getLanguageForEditor = () => {
    if (technology === "css") return activeTab;
    if (technology === "tailwind") return "javascript";
    return "html";
  };

  // Preview logic (like ComponentEditor)
  const renderPreview = () => {
    if (technology === "css") {
      if (!htmlCode && !cssCode) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      // Always render the preview using htmlCode and cssCode, never show code as text
      const hasHtml = htmlCode && htmlCode.trim() !== "";
      const hasCss = cssCode && cssCode.trim() !== "";
      if (!hasHtml) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
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
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
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
          style={{ background: "transparent" }}
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
                {component.createdBy.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">
                  {component.createdBy.name || "Anonymous"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {component.createdBy.email || ""}
                </div>
                {component.creatorStatus && (
                  <div className="text-xs text-primary mt-1">
                    {component.creatorStatus === "original" &&
                      "✓ Original Creator"}
                    {component.creatorStatus === "found" && "Found & Shared"}
                    {component.creatorStatus === "modified" &&
                      "Found & Modified"}
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
                    else if (activeTab === "tailwind")
                      codeToCopy = tailwindCode;
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
            {technology === "css" && (
              <div className="flex border-b bg-muted/50">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "html"
                      ? "bg-background text-purple-700 border-b-2 border-purple-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("html")}
                >
                  HTML
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "css"
                      ? "bg-background text-purple-700 border-b-2 border-purple-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("css")}
                >
                  CSS
                </button>
              </div>
            )}
            <div className="flex-1">
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
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col gap-6 mt-6 pt-6 border-t">
          <div className="flex gap-4 items-center">
            {/* Likes UI */}
            <Button
              variant={likedByMe ? "default" : "outline"}
              disabled={likeLoading}
              onClick={async () => {
                setLikeLoading(true);
                try {
                  const method = likedByMe ? "DELETE" : "POST";
                  const url = `/api/components/${id}/like`;
                  const payload = undefined; // No body sent
                  console.log("[Like] Request:", { method, url, payload });
                  const res = await fetch(url, {
                    method,
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                  });
                  console.log("[Like] Response status:", res.status);
                  if (!res.ok) throw new Error("Failed to update like");
                  setLikedByMe(!likedByMe);
                  setLikesCount((prev) => likedByMe ? prev - 1 : prev + 1);
                  console.log("[Like] Updated state: likedByMe =", !likedByMe, "likesCount =", likedByMe ? likesCount - 1 : likesCount + 1);
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
            >
              {likeLoading
                ? "Processing..."
                : likedByMe
                ? "Unlike"
                : "Like"}
            </Button>
            <span className="text-sm text-muted-foreground">
              👍 {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </span>
            <span className="text-sm text-muted-foreground">
              💬 {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </span>
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
          {/* Comments UI */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">Comments</h4>
            <form
              className="flex gap-2 mb-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentText.trim()) return;
                setCommentsLoading(true);
                try {
                  console.log("[Comment] Posting comment for component", id, "text:", commentText);
                  const res = await fetch(`/api/components/${id}/comments`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({ text: commentText }),
                  });
                  console.log("[Comment] Response status:", res.status);
                  if (!res.ok) throw new Error("Failed to post comment");
                  const newComment = await res.json();
                  setComments((prev) => [newComment, ...prev]);
                  setCommentText("");
                  console.log("[Comment] Added new comment:", newComment);
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
            >
              <input
                className="flex-1 border rounded px-3 py-2"
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentsLoading}
              />
              <Button type="submit" disabled={commentsLoading || !commentText.trim()}>
                {commentsLoading ? "Posting..." : "Post"}
              </Button>
            </form>
            <div className="space-y-3">
              {comments.length === 0 && (
                <div className="text-muted-foreground text-sm">No comments yet.</div>
              )}
              {comments.map((c) => (
                <div key={c._id} className="p-2 rounded bg-background border">
                  <div className="font-medium">{c.user?.name || "User"}</div>
                  <div className="text-sm">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;
