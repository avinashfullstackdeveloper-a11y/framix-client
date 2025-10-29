// Card UI extracted from Components.tsx (lines 717–783)
import React, { useRef, useState, useEffect, useMemo } from "react";

export type ComponentItem = {
  _id: string;
  title: string;
  type: string;
  code?: string;
  language?: string;
  badge?: "Free" | "Pro";
  stats?: string;
  htmlCode?: string;
  cssCode?: string;
  tailwind?: string;
  views?: number;
};

type ComponentShowcaseCardProps = {
  componentItem: ComponentItem;
  onClick?: (item: ComponentItem) => void;
};

const OptimizedPreview: React.FC<{ componentItem: ComponentItem }> = React.memo(
  ({ componentItem }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "50px",
          threshold: 0.1,
        }
      );
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    }, []);

    const previewContent = useMemo(() => {
      if (!isVisible) return null;

      // Tailwind preview
      if (
        componentItem.language &&
        (componentItem.language.toLowerCase() === "tailwind" ||
          componentItem.language.toLowerCase() === "tailwindcss") &&
        (componentItem.code || componentItem.tailwind)
      ) {
        const tailwindHtml = componentItem.code || componentItem.tailwind || "";
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
              ${tailwindHtml}
            </body>
          </html>
        `;
        return (
          <iframe
            title="Preview"
            srcDoc={srcDoc}
            className="w-full h-full rounded-lg border-0"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              width: "100%",
              height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }

      // Direct full HTML document preview
      if (
        typeof componentItem.code === "string" &&
        componentItem.code.trim().startsWith("<!DOCTYPE html")
      ) {
        return (
          <iframe
            title="Preview"
            srcDoc={componentItem.code}
            className="w-full h-full rounded-lg border-0"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              width: "100%",
              height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }

      // React preview
      if (
        componentItem.language &&
        componentItem.language.toLowerCase() === "react"
      ) {
        const srcDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
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
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  ${componentItem.code}
                  if (typeof Component !== "undefined") {
                    ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
                  }
                } catch (e) {
                  document.getElementById('root').innerHTML = '<pre style="color:red;">' + e.toString() + '</pre>';
                }
              </script>
            </body>
          </html>
        `;
        return (
          <iframe
            title="Preview"
            srcDoc={srcDoc}
            className="w-full h-full rounded-lg border-0"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              width: "100%",
              height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }

      // Multi preview
      if (
        componentItem.language &&
        componentItem.language.toLowerCase() === "multi"
      ) {
        const srcDoc =
          componentItem.code ||
          `
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
                  overflow: hidden;
                }
                ${componentItem.cssCode || ""}
              </style>
            </head>
            <body>
              ${componentItem.htmlCode || ""}
            </body>
          </html>
        `;
        return (
          <iframe
            title="Preview"
            srcDoc={srcDoc}
            className="border-0"
            style={{
              width: "100%",
              height: "100%",
              margin: 0,
              padding: 0,
              overflow: "hidden",
              background: "transparent",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }

      // CSS + HTML combined preview
      if (
        componentItem.language &&
        componentItem.language.toLowerCase() === "css" &&
        componentItem.htmlCode &&
        componentItem.cssCode
      ) {
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
                  overflow: hidden;
                }
                ${componentItem.cssCode}
              </style>
            </head>
            <body>
              ${componentItem.htmlCode}
            </body>
          </html>
        `;
        return (
          <iframe
            title="Preview"
            srcDoc={srcDoc}
            className="w-full h-full rounded-lg border-0"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              width: "100%",
              height: "100%",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        );
      }

      // Fallback: HTML/CSS/JS preview
      const srcDoc = `<!DOCTYPE html>
        <html>
          <head>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body, html {
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              #preview-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                transform: scale(0.5);
                transform-origin: center;
              }
              ${
                componentItem.language &&
                componentItem.language.toLowerCase() === "css"
                  ? componentItem.code
                  : ""
              }
            </style>
          </head>
          <body>
            <div id="preview-wrapper">
              ${
                componentItem.language &&
                componentItem.language.toLowerCase() === "html"
                  ? componentItem.code
                  : ""
              }
            </div>
            <script>${
              componentItem.language &&
              componentItem.language.toLowerCase() === "javascript"
                ? componentItem.code
                : ""
            }</script>
          </body>
        </html>`;
      return (
        <iframe
          title="Preview"
          srcDoc={srcDoc}
          className="w-full h-full rounded-lg border-0"
          style={{
            margin: 0,
            padding: 0,
            background: "transparent",
            width: "100%",
            height: "100%",
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }, [isVisible, componentItem]);

    if (!isVisible) {
      return (
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center"
          style={{ minHeight: "200px" }}
        >
          <div className="text-muted-foreground text-sm">Loading preview...</div>
        </div>
      );
    }

    return <>{previewContent}</>;
  }
);

const ComponentShowcaseCard: React.FC<ComponentShowcaseCardProps> = ({
  componentItem,
  onClick,
}) => {
  return (
    <div
      key={componentItem._id}
      onClick={onClick ? () => onClick(componentItem) : undefined}
      className="cursor-pointer w-full"
    >
      <div
        className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group"
        style={{ backgroundColor: "#F4F5F6" }}
      >
        <div
          className="flex h-full flex-col justify-center items-center shrink-0 absolute w-full rounded-2xl sm:rounded-3xl left-0 top-0 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden"
          style={{ backgroundColor: "#F4F5F6" }}
        >
          {componentItem.language && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: "scale(0.6)",
                transformOrigin: "center",
              }}
            >
              <OptimizedPreview componentItem={componentItem} />
            </div>
          )}
        </div>
        <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
          <div className="flex justify-between items-center self-stretch mb-1 sm:mb-2.5">
            <h3 className="flex-[1_0_0] text-black text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="block text-base sm:text-lg font-semibold text-black">
                {componentItem.type
                  ?.replace(/component/gi, "")
                  .trim()
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </span>
            </h3>
            <div className="flex justify-center items-center rounded pl-2 sm:pl-3 pr-2 sm:pr-[11px] pt-[2px] sm:pt-[3px] pb-0.5 transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
              <span
                className={`text-xs sm:text-sm font-normal ${
                  componentItem.badge === "Pro"
                    ? "text-[#FF479C]"
                    : "text-black"
                }`}
              >
                {componentItem.badge || "Free"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcaseCard;