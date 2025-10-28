// BugReportPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as DialogModalHeader,
  DialogTitle as DialogModalTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Bug, Calendar, User, AlertTriangle } from "lucide-react";

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
    apiRequest<any>("/api/bug-reports")
      .then((data) => {
        // Defensive: extract array from paginated response, fallback to empty array
        const reports = Array.isArray(data)
          ? data
          : Array.isArray(data?.bugReports)
            ? data.bugReports
            : [];
        if (!ignore) setBugReports(reports);
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
    return (
      <div className="text-center text-red-500 mt-10">
        Access denied. Admins only.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="text-[#FF479C]">Bug</span> Reports
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#767676] max-w-3xl mx-auto px-4">
          Review and manage all reported bugs with detailed information and user
          context.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-[#FF479C]" />
              <span className="text-white">{bugReports.length}</span>
              <span className="text-[#767676]">Total Reports</span>
            </div>
            <div className="w-px h-6 bg-[#3A3A3A]"></div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF479C]" />
              <span className="text-[#FF479C] font-medium">Admin Access</span>
              <span className="text-[#767676]">Priority Review</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg text-white py-12">
          Loading bug reports...
        </div>
      ) : bugReports.length === 0 ? (
        <div className="text-center w-full col-span-3 py-16">
          <Bug className="w-16 h-16 text-[#767676] mx-auto mb-4" />
          <p className="text-[#767676] text-lg">No bug reports found</p>
          <p className="text-[#767676] text-sm mt-1">
            Bug reports will appear here once submitted by users
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bugReports.map((bug) => (
            <Dialog
              key={bug._id}
              open={selected?._id === bug._id}
              onOpenChange={(open) => setSelected(open ? bug : null)}
            >
              <DialogTrigger asChild>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] text-white"
                  onClick={() => setSelected(bug)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bug className="w-5 h-5 text-[#FF479C]" />
                        <span>{bug.title}</span>
                      </div>
                      <span className="text-sm text-[#FF479C] flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {bug.username || "Unknown"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[#767676]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(bug.createdAt).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-[rgba(0,0,0,0.95)] border border-[#3A3A3A] text-white max-w-2xl">
                <DialogModalHeader>
                  <DialogModalTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Bug className="w-5 h-5 text-[#FF479C]" />
                    {bug.title}
                  </DialogModalTitle>
                  <DialogDescription className="text-[#767676] mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          <span className="font-semibold text-white">
                            Reported by:
                          </span>{" "}
                          {bug.username || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          <span className="font-semibold text-white">
                            Date:
                          </span>{" "}
                          {new Date(bug.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogModalHeader>
                <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-4 mt-4">
                  <div className="text-sm text-[#767676] mb-2">
                    Description:
                  </div>
                  <div className="text-white whitespace-pre-line text-base">
                    {bug.description}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugReportPage;
