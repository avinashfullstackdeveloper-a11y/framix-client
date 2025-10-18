import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

export type CreatorStatus = "original" | "found" | "modified";

export interface CreatorVerificationModalProps {
  onClose: () => void;
  onSubmit: (creatorStatus: CreatorStatus) => void;
  htmlCode?: string;
  cssCode?: string;
  tailwindCode?: string;
  technology?: "css" | "tailwind";
}

interface CreatorFormData {
  creatorStatus: CreatorStatus;
}

export const CreatorVerificationModal: React.FC<
  CreatorVerificationModalProps
> = ({
  onClose,
  onSubmit,
  htmlCode = "",
  cssCode = "",
  tailwindCode = "",
  technology = "css",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch } = useForm<CreatorFormData>({
    defaultValues: {
      creatorStatus: "original",
    },
  });

  const selectedValue = watch("creatorStatus");
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal for accessibility
  useEffect(() => {
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    if (!modal) return;

    const focusableEls =
      modal.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusableEls.length) focusableEls[0].focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    modal.addEventListener("keydown", handleKeyDown);
    return () => modal.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFormSubmit = async (data: { creatorStatus: CreatorStatus }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data.creatorStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{ overscrollBehavior: "contain" }}
    >
      <div
        className="relative bg-[rgba(26,26,29,1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col max-w-[920px] w-full rounded-2xl border-0 max-h-[90vh] overflow-y-auto focus:outline-none"
        style={{ boxSizing: "border-box" }}
      >
        <header className="flex justify-end mb-6 sticky top-0 bg-[rgba(26,26,29,1)] z-20 px-6 pt-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="min-h-6 w-6 hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Close modal"
            tabIndex={0}
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/4d1d6994a5409cf950029e461795b648e4ed4c9f?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-full"
              alt="Close"
            />
          </button>
        </header>

        <main className="flex flex-col md:flex-row w-full max-w-[824px] mx-auto gap-8 px-6 pb-12 max-md:px-3 max-md:pb-6">
          {/* Left: Live Preview */}
          <section
            className="flex-1 flex items-center justify-center min-h-[315px] max-w-[380px] w-full bg-neutral-200 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] rounded-[14px] p-6 overflow-auto"
            aria-label="Post preview"
          >
            <div className="w-full h-full flex items-center justify-center">
              {technology === "css" ? (
                <iframe
                  srcDoc={`<!DOCTYPE html>
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
                          ${cssCode || ""}
                        </style>
                      </head>
                      <body>
                        ${htmlCode || ""}
                      </body>
                    </html>`}
                  className="w-full h-full border-0"
                  style={{ background: "transparent", minHeight: 200 }}
                  sandbox="allow-scripts allow-same-origin"
                  title="Live Preview"
                />
              ) : (
                <iframe
                  srcDoc={`<!DOCTYPE html>
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
                        ${tailwindCode || ""}
                      </body>
                    </html>`}
                  className="w-full h-full border-0"
                  style={{ background: "transparent", minHeight: 200 }}
                  sandbox="allow-scripts allow-same-origin"
                  title="Live Preview"
                />
              )}
            </div>
          </section>

          {/* Right: Form and Info */}
          <section className="flex-1 flex flex-col items-stretch max-w-[400px] w-full">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col w-full"
              tabIndex={0}
            >
              <fieldset className="w-full border-0 p-0 m-0">
                <legend
                  id="modal-title"
                  className="flex flex-col text-[28px] text-white font-medium py-0.5"
                >
                  <span className="leading-[35px]">
                    Are you the original creator of
                  </span>
                  <span className="leading-none">this element?</span>
                </legend>

                <div className="mt-8 space-y-6" id="modal-description">
                  {/* Option 1 */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      {...register("creatorStatus")}
                      type="radio"
                      value="original"
                      id="original"
                      className="sr-only"
                    />
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors ${
                        selectedValue === "original"
                          ? "bg-[rgba(255,71,156,1)] border-[rgba(255,71,156,1)]"
                          : "border-[rgba(74,74,82,1)] group-hover:border-[rgba(255,71,156,0.5)]"
                      }`}
                      aria-checked={selectedValue === "original"}
                      aria-label="Yes, I am the original creator"
                    >
                      {selectedValue === "original" && (
                        <span className="bg-white w-2 h-2 rounded-full block" />
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[rgba(229,229,231,1)] text-[15px] font-medium leading-relaxed">
                        Yes, I am the original creator
                      </span>
                    </span>
                  </label>

                  {/* Option 2 */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      {...register("creatorStatus")}
                      type="radio"
                      value="found"
                      id="found"
                      className="sr-only"
                    />
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors ${
                        selectedValue === "found"
                          ? "bg-[rgba(255,71,156,1)] border-[rgba(255,71,156,1)]"
                          : "border-[rgba(74,74,82,1)] group-hover:border-[rgba(255,71,156,0.5)]"
                      }`}
                      aria-checked={selectedValue === "found"}
                      aria-label="No, I found this post somewhere else"
                    >
                      {selectedValue === "found" && (
                        <span className="bg-white w-2 h-2 rounded-full block" />
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[rgba(229,229,231,1)] text-[15px] font-medium leading-relaxed">
                        No, I found this post somewhere else and I want to share
                        it with the community here
                      </span>
                    </span>
                  </label>

                  {/* Option 3 */}
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input
                      {...register("creatorStatus")}
                      type="radio"
                      value="modified"
                      id="modified"
                      className="sr-only"
                    />
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors ${
                        selectedValue === "modified"
                          ? "bg-[rgba(255,71,156,1)] border-[rgba(255,71,156,1)]"
                          : "border-[rgba(74,74,82,1)] group-hover:border-[rgba(255,71,156,0.5)]"
                      }`}
                      aria-checked={selectedValue === "modified"}
                      aria-label="No, I found this post and made changes"
                    >
                      {selectedValue === "modified" && (
                        <span className="bg-white w-2 h-2 rounded-full block" />
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[rgba(229,229,231,1)] text-[15px] font-medium leading-relaxed">
                        No, I found this post somewhere else and I made
                        significant changes to it
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* Warning Message */}
              <aside
                className="flex items-start text-sm text-yellow-400 font-medium mt-8 gap-3"
                role="alert"
                aria-label="Important warning"
              >
                <img
                  src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/9e5cf6b5d093bde6d1cc529106add6e556e0e795?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 shrink-0 mt-0.5"
                  alt="Warning icon"
                />
                <span className="leading-5">
                  If you repost without crediting the source, your account may
                  be suspended.
                </span>
              </aside>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[rgba(255,71,156,1)] flex min-h-[51px] w-full items-center gap-2 text-[15px] text-white font-medium justify-center mt-8 rounded-[10px] hover:bg-[rgba(255,71,156,0.9)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(255,71,156,0.5)] focus:ring-offset-2 focus:ring-offset-[rgba(26,26,29,1)]"
                aria-label="Submit form for review"
              >
                <img
                  src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/f92be07250437a765a6daa252475ae08d35b68b7?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-4 shrink-0"
                  alt=""
                />
                <span>Submit for review</span>
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};
