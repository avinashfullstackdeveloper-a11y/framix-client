// MyComponentCard.tsx
import React from "react";
import ComponentShowcaseCard, { ComponentItem } from "./ComponentShowcaseCard";
import { Badge } from "@/components/ui/badge";

export interface MyComponentSubmission {
  _id: string;
  title: string;
  componentType: string;
  technology: string;
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  status: "pending" | "approved" | "rejected";
  views?: number;
}

function renderPreview(submission: MyComponentSubmission) {
  if (submission.technology === "css") {
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
            ${submission.cssCode || ""}
          </style>
        </head>
        <body>
          ${submission.htmlCode || ""}
        </body>
      </html>
    `;
    return (
      <iframe
        srcDoc={srcDoc}
        className="w-full h-full border-0"
        style={{ background: "transparent", minHeight: 200 }}
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
      />
    );
  } else if (submission.technology === "tailwind") {
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
          ${submission.tailwindCode || ""}
        </body>
      </html>
    `;
    return (
      <iframe
        srcDoc={srcDoc}
        className="w-full h-full border-0"
        style={{ background: "transparent", minHeight: 200 }}
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
      />
    );
  }
  return <div className="text-gray-400">No preview available</div>;
}

function getStatusBadgeProps(
  status: MyComponentSubmission["status"]
): { variant: "default" | "destructive" | "outline" | "secondary"; label: string } {
  switch (status) {
    case "approved":
      return { variant: "default", label: "approved" };
    case "rejected":
      return { variant: "destructive", label: "rejected" };
    default:
      return { variant: "secondary", label: "pending" };
  }
}

const MyComponentCard: React.FC<{ submission: MyComponentSubmission }> = ({
  submission,
}) => {
  // Map MyComponentSubmission to ComponentItem
  const componentItem: ComponentItem = {
    _id: submission._id,
    title: submission.title,
    type: submission.componentType,
    code:
      submission.technology === "css"
        ? undefined
        : submission.technology === "tailwind"
        ? submission.tailwindCode
        : undefined,
    language: submission.technology,
    htmlCode: submission.htmlCode,
    cssCode: submission.cssCode,
    tailwind: submission.tailwindCode,
    views: submission.views,
    // badge, stats, etc. can be extended if needed
  };

  const statusBadge = getStatusBadgeProps(submission.status);

  return (
    <div className="relative">
      {/* Views badge at top left */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-[rgba(0,0,0,0.45)] px-2 py-1 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z"
            stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="white" strokeOpacity="0.6" strokeWidth="1.5"/>
        </svg>
        <span className="text-white text-xs font-light">
          {submission.views || 0} views
        </span>
      </div>
      {/* Status badge at top right */}
      <div className="absolute top-3 right-3 z-20">
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>
      {/* Card UI */}
      <ComponentShowcaseCard componentItem={componentItem} />
      {/* Overlay badges at bottom left (if not handled by ComponentShowcaseCard) */}
    </div>
  );
};

export default MyComponentCard;