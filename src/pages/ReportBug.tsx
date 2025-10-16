import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReportBug: React.FC = () => {
  const [bugDescription, setBugDescription] = useState("");
  const maxCharacters = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bugDescription.trim()) {
      // Handle form submission here
      console.log("Bug report submitted:", bugDescription);
      // You could add actual submission logic here
      alert("Bug report submitted successfully!");
      setBugDescription("");
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setBugDescription(value);
    }
  };

  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center min-h-screen w-full">
      <div className="w-[942px] max-w-full flex flex-col items-center justify-center">
        {/* Go Back Button */}
        <div className="w-full flex justify-center mb-6">
          <Button
            variant="default"
            size="lg"
            className="rounded-[30px] px-8 py-3 text-base font-semibold"
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </div>
        <div className="flex w-[453px] max-w-full flex-col items-stretch text-center">
          <div className="flex w-full flex-col text-4xl text-white font-semibold leading-none max-md:max-w-full max-md:pr-5">
            <h1>Report a Bug</h1>
          </div>
          <p className="text-white text-base font-normal mt-3 max-md:max-w-full">
            Help us improve by reporting any issues or bugs you encounter.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full text-sm leading-none mt-8 max-md:max-w-full"
        >
          <div className="bg-black border min-h-[200px] w-full text-white font-normal pt-5 px-5 rounded-[14px] border-[rgba(255,154,201,0.6)] border-solid max-md:max-w-full">
            <div className="bg-black flex min-h-[120px] w-full overflow-hidden pt-2 pb-[92px] px-3 rounded-[14px] max-md:max-w-full">
              <textarea
                value={bugDescription}
                onChange={handleTextareaChange}
                placeholder="Bug Description"
                className="w-full h-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-400"
                aria-label="Bug Description"
                maxLength={maxCharacters}
              />
            </div>
          </div>

          <div className="text-white font-semibold text-right mt-[18px] max-md:max-w-full">
            {bugDescription.length}/{maxCharacters} characters
          </div>

          <button
            type="submit"
            className="bg-[rgba(235,142,185,1)] flex min-h-12 w-full items-center gap-2 text-sm text-black font-semibold leading-none justify-center mt-8 px-[13px] py-3.5 rounded-[30px] max-md:max-w-full hover:bg-[rgba(235,142,185,0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!bugDescription.trim()}
          >
            <span className="self-stretch my-auto">Submit Bug Report</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportBug;
