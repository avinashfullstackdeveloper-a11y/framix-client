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
  const [component, setComponent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("");

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

  // Remove unused effect, code is set in fetch above

  if (loading) return <div>Loading...</div>;
  if (!component) return <div>Component not found.</div>;

  const renderPreview = () => {
    if (component?.language?.toLowerCase() === "react") {
      return (
        <LiveProvider code={code}>
          <LivePreview />
          <LiveError />
        </LiveProvider>
      );
    }
    if (component?.language?.toLowerCase() === "html" || component?.language?.toLowerCase() === "css" || component?.language?.toLowerCase() === "javascript") {
      const srcDoc = `
        <html>
          <head>
            <style>${component.language?.toLowerCase() === "css" ? code : ""}</style>
          </head>
          <body>
            ${component.language?.toLowerCase() === "html" ? code : ""}
            <script>${component.language?.toLowerCase() === "javascript" ? code : ""}</script>
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
            border: "1px solid #333",
            padding: "1rem",
            background: "#222",
            color: "#fafafa",
            resize: "vertical",
          }}
        />
      </div>
    </div>
  );
};

export default ComponentDetail;