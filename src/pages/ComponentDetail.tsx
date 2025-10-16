// ComponentDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../index.css";
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
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Favourites state
  const [isFavourited, setIsFavourited] = useState(false);
  const [savingFavourite, setSavingFavourite] = useState(false);

  const { toast } = useToast();
  // Use only user from AuthContext, get token from user if available
  const { user } = useAuth();
  // Get token from user context or localStorage if available
  const token =
    // Try user.token, fallback to localStorage, avoid 'any' type
    ("token" in (user ?? {}) ? (user as { token?: string }).token : undefined) ||
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
    // Instead of GET /api/favourites/:id, fetch all and check if current id is favourited
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
        // data is array of favourites, check if any matches current id
        const found = Array.isArray(data) && data.some(fav => fav.component && (fav.component._id === id || fav.component === id));
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
        // Add to favourites
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
        // Remove from favourites
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading component...</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Component not found</h2>
        <p>
          The component you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const renderPreview = () => {
    if (component?.language?.toLowerCase() === "react") {
      return (
        <div
          className="preview-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <LiveProvider code={code}>
            <div
              className="live-preview-wrapper"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <LivePreview
                style={{
                  margin: 0,
                  width: "auto",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>
            <LiveError className="live-error" />
          </LiveProvider>
        </div>
      );
    }

    if (component?.language?.toLowerCase() === "multi") {
      return (
        <div
          className="preview-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <iframe
            title="Live Preview"
            srcDoc={component.code}
            className="preview-iframe"
            style={{
              display: "block",
              margin: 0,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      );
    }

    if (
      ["html", "css", "javascript"].includes(component?.language?.toLowerCase())
    ) {
      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: transparent;
              }
              ${component.language?.toLowerCase() === "css" ? code : ""}
            </style>
          </head>
          <body>
            ${component.language?.toLowerCase() === "html" ? code : ""}
            <script>${
              component.language?.toLowerCase() === "javascript" ? code : ""
            }</script>
          </body>
        </html>
      `;
      return (
        <div
          className="preview-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <iframe
            title="Live Preview"
            srcDoc={srcDoc}
            className="preview-iframe"
            style={{
              display: "block",
              margin: 0,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      );
    }

    return (
      <div className="no-preview">
        <div className="no-preview-icon">👁️</div>
        <p>No preview available for this component type</p>
      </div>
    );
  };

  const getLanguageForHighlighting = () => {
    const lang = component?.language?.toLowerCase();
    if (lang === "multi") return "html";
    if (lang === "javascript") return "javascript";
    if (lang === "html") return "html";
    if (lang === "css") return "css";
    if (lang === "react") return "jsx";
    return "text";
  };

  return (
    <div
      className={`component-detail ${isFullscreen ? "fullscreen" : ""}`}
      style={{ position: "relative" }}
    >
      {/* Go Back Button */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          zIndex: 10,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          style={{
            background: "transparent",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: "0",
            padding: "0.5rem 1.25rem",
            boxShadow: "none",
            cursor: "pointer",
            transition: "transform 0.15s",
          }}
        >
          ← Go Back
        </Button>
      </div>
      {/* Header */}
      <header className="component-header">
        <div className="header-content">
          <h1 className="component-title">{component.name}</h1>
          <div className="component-meta">
            {component.tags && component.tags.length > 0 && (
              <div className="tags">
                {component.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="header-actions"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <span
            className="language-badge"
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#6366f1",
              background: "#eef2ff",
              borderRadius: "8px",
              padding: "0.25rem 0.75rem",
              marginRight: "0.5rem",
            }}
          >
            {component.language}
          </span>
          <button
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            Copy Code
          </button>
        </div>
      </header>

      {component.description && (
        <div className="component-description">
          <p>{component.description}</p>
        </div>
      )}

      {/* Main Content */}
      <div
        className="component-content"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          minHeight: "32rem",
          maxHeight: "40rem",
        }}
      >
        {/* Preview Panel Side */}
        <div
          className="preview-panel active"
          style={{ height: "100%", maxHeight: "40rem", overflow: "auto" }}
        >
          <div className="panel-header"></div>
          <div
            className="panel-content"
            style={{ maxHeight: "36rem", overflow: "auto" }}
          >
            {renderPreview()}
          </div>
        </div>

        {/* Code Panel Side */}
        <div
          className="code-panel active"
          style={{ height: "100%", maxHeight: "40rem", overflow: "auto" }}
        >
          {/* Removed code panel heading */}
          <div
            className="panel-content"
            style={{ maxHeight: "36rem", overflow: "auto" }}
          >
            <div className="code-editor">
              <div
                className="editor-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="file-name">
                  {component.name}.{getLanguageForHighlighting()}
                </span>
                <div>
                  <button
                    className="copy-icon"
                    onClick={() => navigator.clipboard.writeText(code)}
                    title="Copy code"
                  >
                    📄
                  </button>
                  <button
                    className="edit-toggle"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    {isEditing ? "Save" : "Edit Code"}
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: "32rem", overflow: "auto" }}>
                {isEditing ? (
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="code-textarea"
                    spellCheck="false"
                    style={{
                      width: "100%",
                      height: "28rem",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      borderRadius: "0 0 12px 12px",
                      padding: "1rem",
                      boxSizing: "border-box",
                      resize: "vertical",
                      background: "#1e1e1e",
                      color: "#fff",
                      border: "1px solid #333",
                    }}
                  />
                ) : (
                  <SyntaxHighlighter
                    language={getLanguageForHighlighting()}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0 0 12px 12px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    showLineNumbers
                  >
                    {code}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Horizontal Action Bar */}
      <div
        className="component-action-bar"
        style={{
          gridColumn: "1 / span 2",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          padding: "1.25rem 0 0 0",
        }}
      >
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
  );
};

export default ComponentDetail;
