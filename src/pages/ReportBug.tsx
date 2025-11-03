import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const ReportBug: React.FC = () => {
  const [title, setTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const maxTitleCharacters = 100;
  const maxDescriptionCharacters = 500;
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!title.trim() || !bugDescription.trim()) return;
    setLoading(true);
    try {
      const response = await apiRequest("/api/bug-reports", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: bugDescription.trim(),
          username: user?.username || user?.name || undefined,
        }),
      });
      setFeedback({
        type: "success",
        message: "Bug report submitted successfully!",
      });
      setTitle("");
      setBugDescription("");
    } catch (err) {
      console.error("Bug report submission error:", err);
      const errorMsg =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Failed to submit bug report.";
      setFeedback({
        type: "error",
        message: errorMsg || "Failed to submit bug report.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen w-full px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-[942px] flex flex-col items-center justify-center">
        {/* Go Back Button */}
        <div className="w-full flex justify-center mb-4 sm:mb-6">
          <Button
            variant="default"
            size="lg"
            className="rounded-[30px] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </div>
        <div className="flex w-full max-w-[453px] flex-col items-stretch text-center px-4 sm:px-0">
          <div className="flex w-full flex-col text-2xl sm:text-3xl md:text-4xl text-white font-semibold leading-tight sm:leading-none">
            <h1>Report a Bug</h1>
          </div>
          <p className="text-white text-sm sm:text-base font-normal mt-2 sm:mt-3">
            Help us improve by reporting any issues or bugs you encounter.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full text-sm leading-none mt-6 sm:mt-8"
        >
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= maxTitleCharacters)
                  setTitle(e.target.value);
              }}
              placeholder="Bug Title"
              className="w-full bg-black border border-[#FF479C] rounded-[14px] px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-white placeholder-gray-400 outline-none mb-2 min-h-[44px]"
              aria-label="Bug Title"
              maxLength={maxTitleCharacters}
              disabled={loading}
              required
            />
            <div className="text-white text-xs sm:text-sm text-right">
              {title.length}/{maxTitleCharacters} characters
            </div>
          </div>
          <div className="bg-black border min-h-[180px] sm:min-h-[200px] w-full text-white font-normal pt-4 sm:pt-5 px-4 sm:px-5 rounded-[14px] border-[#FF479C] border-solid">
            <div className="bg-black flex min-h-[120px] sm:min-h-[140px] w-full overflow-hidden pt-2 pb-16 sm:pb-[92px] px-2 sm:px-3 rounded-[14px]">
              <textarea
                value={bugDescription}
                onChange={(e) => {
                  if (e.target.value.length <= maxDescriptionCharacters)
                    setBugDescription(e.target.value);
                }}
                placeholder="Bug Description"
                className="w-full h-full bg-transparent border-none outline-none resize-none text-sm sm:text-base text-white placeholder-gray-400"
                aria-label="Bug Description"
                maxLength={maxDescriptionCharacters}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="text-white font-semibold text-xs sm:text-sm text-right mt-3 sm:mt-[18px]">
            {bugDescription.length}/{maxDescriptionCharacters} characters
          </div>

          <button
            type="submit"
            className="bg-[#FF479C] flex min-h-[44px] sm:min-h-12 w-full items-center gap-2 text-sm sm:text-base text-white font-semibold leading-none justify-center mt-6 sm:mt-8 px-4 sm:px-[13px] py-3 sm:py-3.5 rounded-[30px] hover:bg-[#E63E8C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title.trim() || !bugDescription.trim() || loading}
          >
            <span className="self-stretch my-auto">
              {loading ? "Submitting..." : "Submit Bug Report"}
            </span>
          </button>
          {feedback && (
            <div
              className={`mt-3 sm:mt-4 text-center text-sm sm:text-base font-semibold ${
                feedback.type === "success" ? "text-green-400" : "text-red-400"
              }`}
              role="alert"
            >
              {feedback.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ReportBug;
