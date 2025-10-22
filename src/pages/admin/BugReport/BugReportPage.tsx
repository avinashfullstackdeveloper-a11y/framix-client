import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogModalHeader, DialogTitle as DialogModalTitle, DialogDescription } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type BugReport = {
  _id: string;
  title: string;
  description: string;
  username?: string;
  createdAt: string;
};

const BugReportPage: React.FC = () => {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [selected, setSelected] = useState<BugReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    apiRequest<BugReport[]>("/api/bug-reports")
      .then((data) => {
        console.log("Fetched bug reports:", data);
        if (!ignore) setBugReports(data);
      })
      .catch((err) => {
        console.error("Error fetching bug reports:", err);
        toast({
          title: "Failed to fetch bug reports",
          description: err?.message || "Unknown error",
        });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [toast]);

  if (!user || user.role !== "admin") {
    // Should never render due to ProtectedRoute, but double check
    return (
      <div className="text-center text-red-500 mt-10">
        Access denied. Admins only.
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Bug Reports</h1>
      {loading ? (
        <div className="text-white">Loading bug reports...</div>
      ) : bugReports.length === 0 ? (
        <div className="text-white">No bug reports found.</div>
      ) : (
        <div className="grid gap-6">
          {bugReports.map((bug) => (
            <Dialog key={bug._id} open={selected?._id === bug._id} onOpenChange={open => setSelected(open ? bug : null)}>
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-[#18181b] border-[#FF9AC9] text-white"
                  onClick={() => setSelected(bug)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{bug.title}</span>
                      <span className="text-xs text-[#FF9AC9] ml-2">{bug.username || "Unknown"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs text-gray-400">
                      {new Date(bug.createdAt).toLocaleString()}
                    </span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogModalHeader>
                  <DialogModalTitle>{bug.title}</DialogModalTitle>
                  <DialogDescription>
                    <div className="mt-2 mb-4 text-sm text-gray-400">
                      <span className="font-semibold text-white">Reported by:</span> {bug.username || "Unknown"}
                      <br />
                      <span className="font-semibold text-white">Date:</span> {new Date(bug.createdAt).toLocaleString()}
                    </div>
                  </DialogDescription>
                </DialogModalHeader>
                <div className="text-base text-white whitespace-pre-line">{bug.description}</div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </section>
  );
};

export default BugReportPage;