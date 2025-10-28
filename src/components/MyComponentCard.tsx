// MyComponentCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const statusBadge = getStatusBadgeProps(submission.status);

  return (
    <Card className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group" style={{ backgroundColor: "#F4F5F6" }}>
      <CardContent className="p-0 w-full h-full">
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
        {/* Preview area */}
        <div className="flex h-full flex-col justify-center items-center shrink-0 absolute w-full rounded-2xl sm:rounded-3xl left-0 top-0 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden" style={{ backgroundColor: "#F4F5F6" }}>
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
            {renderPreview(submission)}
          </div>
          {/* Status badge at top right */}
          <div className="absolute top-3 right-3">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
        </div>
        {/* Bottom overlay with title and badges */}
        <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-black border-black">
              {submission.componentType
                ?.replace(/component/gi, "")
                .trim()
                .replace(/^\w/, (c) => c.toUpperCase())}
            </Badge>
            <Badge variant="outline" className="text-black border-black">{submission.technology}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyComponentCard;