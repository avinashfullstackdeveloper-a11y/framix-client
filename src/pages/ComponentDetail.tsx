// ComponentDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LiveProvider, LivePreview, LiveError } from "react-live";

type ComponentData = {
  id: string;
  name: string;
  code: string;
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

  useEffect(() => {
    fetch(`/components/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComponent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (component) {
      if (component.react) {
        setCode(component.react);
      } else {
        setCode(
          [
            component.html || "",
            component.css ? `<style>${component.css}</style>` : "",
            component.js ? `<script>${component.js}</script>` : "",
          ]
            .filter(Boolean)
            .join("\n")
        );
      }
    }
  }, [component]);

  if (loading) return <div>Loading...</div>;
  if (!component) return <div>Component not found.</div>;

  const renderPreview = () => {
    if (component?.react) {
      return (
        <LiveProvider code={code} noInline>
          <LivePreview />
          <LiveError />
        </LiveProvider>
      );
    }
    if (component?.html || component?.css || component?.js) {
      const srcDoc = `
        <html>
          <head>
            <style>${component.css || ""}</style>
          </head>
          <body>
            ${component.html || ""}
            <script>${component.js || ""}</script>
          </body>
        </html>
      `;
      return (
        <iframe
          title="Live Preview"
          srcDoc={srcDoc}
          style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
        />
      );
    }
    return <div>No preview available.</div>;
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <h2>Live Preview</h2>
        {renderPreview()}
      </div>
      <div style={{ flex: 1 }}>
        <h2>Code</h2>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{
            width: "100%",
            height: "400px",
            fontFamily: "monospace",
            fontSize: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
            background: "#fafafa",
          }}
        />
      </div>
    </div>
  );
};

export default ComponentDetail;