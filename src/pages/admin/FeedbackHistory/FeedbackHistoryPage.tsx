import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogModalHeader,
  DialogTitle as DialogModalTitle,
  DialogDescription as DialogModalDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

type FeedbackSummary = {
  _id: string;
  username: string;
  rating: number;
};

type FeedbackDetail = {
  _id: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const FeedbackHistoryPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<FeedbackDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiRequest<FeedbackSummary[]>("/api/feedback")
      .then(setFeedbackList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      setDetailError(null);
      return;
    }
    setDetailLoading(true);
    setDetailError(null);
    apiRequest<FeedbackDetail>(`/api/feedback/${selectedId}`)
      .then(setDetail)
      .catch((e) => setDetailError(e.message))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Feedback History</h2>
      {loading ? (
        <div>Loading feedback...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : feedbackList.length === 0 ? (
        <div>No feedback found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbackList.map((fb) => (
            <Card
              key={fb._id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedId(fb._id)}
            >
              <CardHeader>
                <CardTitle>{fb.username}</CardTitle>
                <CardDescription>
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < fb.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent>
          <DialogModalHeader>
            <DialogModalTitle>Feedback Details</DialogModalTitle>
          </DialogModalHeader>
          {detailLoading ? (
            <div>Loading...</div>
          ) : detailError ? (
            <div className="text-red-500">Error: {detailError}</div>
          ) : detail ? (
            <div>
              <div className="mb-2 font-semibold">{detail.username}</div>
              <div className="mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < detail.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <div className="mb-2 text-sm text-muted-foreground">
                {new Date(detail.createdAt).toLocaleString()}
              </div>
              <div className="mb-2">{detail.comment}</div>
            </div>
          ) : (
            <div>No details found.</div>
          )}
          <Button variant="outline" onClick={() => setSelectedId(null)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackHistoryPage;