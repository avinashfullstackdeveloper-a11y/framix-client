// ComponentDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../index.css";

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
  const [component, setComponent] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch(`/api/components/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComponent(data);
        setCode(data.code || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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
        <p>The component you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const renderPreview = () => {
    if (component?.language?.toLowerCase() === "react") {
      return (
        <div className="preview-container">
          <LiveProvider code={code}>
            <div className="live-preview-wrapper">
              <LivePreview />
            </div>
            <LiveError className="live-error" />
          </LiveProvider>
        </div>
      );
    }

    if (component?.language?.toLowerCase() === "multi") {
      return (
        <div className="preview-container">
          <iframe
            title="Live Preview"
            srcDoc={component.code}
            className="preview-iframe"
          />
        </div>
      );
    }

    if (["html", "css", "javascript"].includes(component?.language?.toLowerCase())) {
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
            <script>${component.language?.toLowerCase() === "javascript" ? code : ""}</script>
          </body>
        </html>
      `;
      return (
        <div className="preview-container">
          <iframe
            title="Live Preview"
            srcDoc={srcDoc}
            className="preview-iframe"
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
    <div className={`component-detail ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Header */}
      <header className="component-header">
        <div className="header-content">
          <h1 className="component-title">{component.name}</h1>
          <div className="component-meta">
            <span className="language-badge">{component.language}</span>
            {component.tags && component.tags.length > 0 && (
              <div className="tags">
                {component.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="icon-button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? "⤵️" : "⤴️"}
          </button>
          <button className="copy-button" onClick={() => navigator.clipboard.writeText(code)}>
            📋 Copy Code
          </button>
        </div>
      </header>

      {component.description && (
        <div className="component-description">
          <p>{component.description}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="component-content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Preview Panel Side */}
        <div className="preview-panel active max-h-[32rem] overflow-auto" style={{ height: "auto" }}>
          <div className="panel-header">
            <h3>Preview</h3>
          </div>
          <div className="panel-content max-h-[28rem] overflow-auto">
            {renderPreview()}
          </div>
        </div>

        {/* Code Panel Side */}
        <div className="code-panel active max-h-[32rem] overflow-auto" style={{ height: "auto" }}>
          <div className="panel-header">
            <h3>Code</h3>
          </div>
          <div className="panel-content max-h-[28rem] overflow-auto">
            <div className="code-editor">
              <div className="editor-header">
                <span className="file-name">{component.name}.{getLanguageForHighlighting()}</span>
                <button
                  className="copy-icon"
                  onClick={() => navigator.clipboard.writeText(code)}
                  title="Copy code"
                >
                  📄
                </button>
              </div>
              <div style={{ maxHeight: "24rem", overflow: "auto" }}>
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
              </div>
            </div>
            
            {/* Editable Code Area (Hidden by default, can be toggled) */}
            <div className="editable-code-section">
              <details className="edit-details">
                <summary>Edit Code</summary>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="code-textarea"
                  spellCheck="false"
                  style={{ maxHeight: "12rem", overflow: "auto" }}
                />
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;