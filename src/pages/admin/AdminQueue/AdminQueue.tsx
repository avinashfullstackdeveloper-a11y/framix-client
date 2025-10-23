import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Submission {
  _id: string;
  title: string;
  componentType: string;
  technology: string;
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  creatorStatus: "original" | "found" | "modified";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
}

const AdminQueue: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || "";

  // Check if user is admin
  useEffect(() => {
    if (user && (user as any).role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const endpoint = filter === "all"
        ? "/api/submissions/all"
        : `/api/submissions/all?status=${filter}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  // Handle approve
  const handleApprove = async (submissionId: string) => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/submissions/${submissionId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ reviewNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve submission");
      }

      toast({
        title: "Success",
        description: "Submission approved and component published!",
        variant: "default",
      });

      setSelectedSubmission(null);
      setReviewNotes("");
      fetchSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve submission",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async (submissionId: string) => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/submissions/${submissionId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ reviewNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject submission");
      }

      toast({
        title: "Success",
        description: "Submission rejected.",
        variant: "default",
      });

      setSelectedSubmission(null);
      setReviewNotes("");
      fetchSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject submission",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Render preview
  const renderPreview = (submission: Submission) => {
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
          style={{ background: "transparent", minHeight: 300 }}
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
          style={{ background: "transparent", minHeight: 300 }}
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      );
    }
    return <div className="text-gray-400">No preview available</div>;
  };

  const getCreatorStatusLabel = (status: string) => {
    switch (status) {
      case "original":
        return "Original Creator";
      case "found":
        return "Found & Shared";
      case "modified":
        return "Found & Modified";
      default:
        return status;
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Component Submission Queue</h1>
          <p className="text-muted-foreground">
            Review and approve component submissions from the community
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>

        {/* Submissions Grid */}
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                There are no {filter !== "all" ? filter : ""} submissions at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card
                key={submission._id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardContent className="p-0">
                  {/* Preview */}
                  <div className="aspect-video bg-neutral-200 relative">
                    {renderPreview(submission)}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={
                          submission.status === "approved"
                            ? "default"
                            : submission.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{submission.title}</h3>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{submission.componentType}</Badge>
                      <Badge variant="outline">{submission.technology}</Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        {submission.createdBy.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{submission.createdBy.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {submission.createdBy.email}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      {getCreatorStatusLabel(submission.creatorStatus)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedSubmission.title}</h2>
                    <div className="flex gap-2">
                      <Badge>{selectedSubmission.componentType}</Badge>
                      <Badge>{selectedSubmission.technology}</Badge>
                      <Badge
                        variant={
                          selectedSubmission.status === "approved"
                            ? "default"
                            : selectedSubmission.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {selectedSubmission.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSubmission(null);
                      setReviewNotes("");
                    }}
                  >
                    ✕
                  </Button>
                </div>

                {/* Creator Info */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Submitted By</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {selectedSubmission.createdBy.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{selectedSubmission.createdBy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedSubmission.createdBy.email}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    <strong>Creator Status:</strong>{" "}
                    {getCreatorStatusLabel(selectedSubmission.creatorStatus)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on: {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Preview</h3>
                  <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                    {renderPreview(selectedSubmission)}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedSubmission.status === "pending" && (
                  <div className="mb-6">
                    <label className="block font-semibold mb-2">Review Notes (Optional)</label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={3}
                      placeholder="Add any notes about this submission..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>
                )}

                {/* Existing Review Info */}
                {selectedSubmission.status !== "pending" && selectedSubmission.reviewedBy && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Review Information</h3>
                    <p className="text-sm">
                      <strong>Reviewed By:</strong> {selectedSubmission.reviewedBy.name}
                    </p>
                    <p className="text-sm">
                      <strong>Reviewed At:</strong>{" "}
                      {selectedSubmission.reviewedAt
                        ? new Date(selectedSubmission.reviewedAt).toLocaleString()
                        : "N/A"}
                    </p>
                    {selectedSubmission.reviewNotes && (
                      <p className="text-sm mt-2">
                        <strong>Notes:</strong> {selectedSubmission.reviewNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                {selectedSubmission.status === "pending" && (
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedSubmission._id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleApprove(selectedSubmission._id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Approve & Publish"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueue;
