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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Preview */}
        <div className="aspect-video bg-neutral-200 relative">
          {renderPreview(submission)}
          <div className="absolute top-3 right-3">
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
        </div>
        {/* Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{submission.title}</h3>
          <div className="flex gap-2 mb-3">
            <Badge variant="outline">{submission.componentType}</Badge>
            <Badge variant="outline">{submission.technology}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyComponentCard;