// FeedbackHistoryPage.tsx
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
import { Star, Calendar, User } from "lucide-react";

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
    apiRequest<any>("/api/feedback")
      .then((res) => {
        // Defensive extraction: try common paginated keys, fallback to array
        let list = [];
        if (Array.isArray(res?.feedbacks)) {
          list = res.feedbacks;
        } else if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.results)) {
          list = res.results;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        }
        setFeedbackList(list ?? []);
      })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-[#FF479C]">Feedback</span> History
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#767676] max-w-3xl mx-auto px-4">
          Review and manage all user feedback with detailed insights and
          ratings.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#FF479C]" />
              <span className="text-white">{feedbackList.length}</span>
              <span className="text-[#767676]">Total Feedback</span>
            </div>
            <div className="w-px h-6 bg-[#3A3A3A]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF479C] font-medium">Admin Access</span>
              <span className="text-[#767676]">Full Review</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg text-white py-12">
          Loading feedback...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">Error: {error}</div>
      ) : feedbackList.length === 0 ? (
        <div className="text-center w-full col-span-3 py-16">
          <Star className="w-16 h-16 text-[#767676] mx-auto mb-4" />
          <p className="text-[#767676] text-lg">No feedback found</p>
          <p className="text-[#767676] text-sm mt-1">
            User feedback will appear here once submitted
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(Array.isArray(feedbackList) ? feedbackList : []).map((fb) => (
            <Card
              key={fb._id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] text-white"
              onClick={() => setSelectedId(fb._id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF479C]" />
                    {fb.username}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < fb.rating ? "text-[#FF479C]" : "text-[#3A3A3A]"
                      }
                    >
                      {i < fb.rating ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-xs ml-2 text-[#FF479C]">
                    ({fb.rating}/5)
                  </span>
                </div>
                <CardDescription className="text-[#767676]">
                  Rating out of 5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-[#767676]">
                  <Calendar className="w-3 h-3" />
                  <span>Click to view details</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="bg-[rgba(0,0,0,0.95)] border border-[#3A3A3A] text-white">
          <DialogModalHeader>
            <DialogModalTitle className="text-xl font-bold text-white">
              Feedback Details
            </DialogModalTitle>
          </DialogModalHeader>
          {detailLoading ? (
            <div className="text-center py-8">Loading details...</div>
          ) : detailError ? (
            <div className="text-red-500 text-center py-8">
              Error: {detailError}
            </div>
          ) : detail ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#3A3A3A]">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#FF479C]" />
                  <div className="font-semibold text-lg">{detail.username}</div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < detail.rating ? "text-[#FF479C]" : "text-[#3A3A3A]"
                      }
                    >
                      {i < detail.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#767676]">
                <Calendar className="w-4 h-4" />
                <span>{new Date(detail.createdAt).toLocaleString()}</span>
              </div>

              <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4">
                <div className="text-sm text-[#767676] mb-2">Comment:</div>
                <div className="text-white whitespace-pre-line">
                  {detail.comment || "No comment provided."}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#767676]">
              No details found.
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-[#3A3A3A]">
            <Button
              variant="outline"
              onClick={() => setSelectedId(null)}
              className="border-[#3A3A3A] text-white hover:bg-[#3A3A3A] hover:text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackHistoryPage;
