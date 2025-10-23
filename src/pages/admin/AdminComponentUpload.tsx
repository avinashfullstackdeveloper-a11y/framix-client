import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Upload, Code, FileText, Palette, Settings2, X } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminComponentUploadProps {
  onUploadSuccess?: () => void;
}

const AdminComponentUpload: React.FC<AdminComponentUploadProps> = ({
  onUploadSuccess,
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "",
    language: "html",
    html: "",
    css: "",
    js: "",
  });
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab: "html" | "css" | "js") => {
    setActiveTab(tab);
    setForm((prev) => ({ ...prev, language: tab }));
  };

  const validateAndCleanCode = () => {
    const warnings: string[] = [];

    // Check for viewport units that might cause issues
    if (form.css.includes('100vw') || form.css.includes('100vh')) {
      warnings.push('Using 100vw/100vh may cause preview issues. Consider using fixed dimensions or percentages.');
    }

    // Check if HTML contains full document structure
    if (form.html.includes('<html>') || form.html.includes('<head>') || form.html.includes('<body>')) {
      warnings.push('Remove <html>, <head>, and <body> tags. Only provide the component HTML.');
    }

    return warnings;
  };

  const formatCode = () => {
    // Determine if multiple code fields are filled
    const codeFields = [form.html, form.css, form.js].filter(Boolean);
    const multiLang = codeFields.length > 1;

    if (multiLang) {
      // Build a properly formatted HTML document
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body, html {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ${form.css || ''}
    </style>
  </head>
  <body>
    ${form.html}
    ${form.js ? `<script>\n${form.js}\n    </script>` : ''}
  </body>
</html>`;
    }

    // Single language - return as-is
    return form.html || form.css || form.js;
  };

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate that at least HTML is provided if multi-language
      const codeFields = [form.html, form.css, form.js].filter(Boolean);
      const multiLang = codeFields.length > 1;

      if (multiLang && !form.html) {
        throw new Error("HTML is required when using multiple languages");
      }

      // Run validation checks
      const warnings = validateAndCleanCode();
      if (warnings.length > 0) {
        const confirmUpload = window.confirm(
          `⚠️ Warnings detected:\n\n${warnings.join('\n')}\n\nDo you want to continue uploading?`
        );
        if (!confirmUpload) {
          setLoading(false);
          return;
        }
      }

      const formattedCode = formatCode();

      const jsonBody = {
        title: form.title,
        type: form.type,
        language: multiLang ? "multi" : form.language,
        code: formattedCode,
        html: form.html,
        css: form.css,
        js: form.js,
      };

      await apiRequest("/api/components", {
        method: "POST",
        body: JSON.stringify(jsonBody),
      });

      setSuccess(true);
      toast({
        title: "Component uploaded successfully!",
        variant: "default",
      });
      setForm({
        title: "",
        type: "",
        language: "html",
        html: "",
        css: "",
        js: "",
      });
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error occurred";
      setError(msg);
      toast({
        title: "Upload failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "html":
        return <FileText className="w-4 h-4" />;
      case "css":
        return <Palette className="w-4 h-4" />;
      case "js":
        return <Settings2 className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const clearForm = () => {
    setForm({
      title: "",
      type: "",
      language: "html",
      html: "",
      css: "",
      js: "",
    });
    setActiveTab("html");
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="text-[#FF9AC9]">Upload</span> Component
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Add new components to the showcase with code preview and validation.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-black border-b border-[#3A3A3A] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF9AC9] rounded-lg">
                <Upload className="w-5 h-5 text-[#282828]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  New Component
                </h2>
                <p className="text-[#767676] text-sm mt-1">
                  Fill in the details below
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearForm}
              className="text-white hover:bg-[#3A3A3A] rounded-lg p-2 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-white flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#FF9AC9]" />
                Component Title
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g., Animated Button"
                className="w-full bg-black border-[#3A3A3A] text-white placeholder:text-[#767676] focus:border-[#FF9AC9] transition-all duration-300"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="type"
                className="text-sm font-medium text-white flex items-center gap-2"
              >
                <Code className="w-4 h-4 text-[#FF9AC9]" />
                Component Type
              </Label>
              <Input
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                placeholder="e.g., Button, Card, Navbar"
                className="w-full bg-black border-[#3A3A3A] text-white placeholder:text-[#767676] focus:border-[#FF9AC9] transition-all duration-300"
              />
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#1A1A1A] border border-[#FF9AC9] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#FF9AC9] mb-2 flex items-center gap-2">
              📋 Upload Guidelines
            </h3>
            <ul className="text-xs text-[#767676] space-y-1">
              <li>• <span className="text-white">HTML:</span> Required if using CSS/JS. Provide only component markup</li>
              <li>• <span className="text-white">CSS:</span> Avoid viewport units (100vw, 100vh) - components are scaled</li>
              <li>• <span className="text-white">Preview:</span> Components scaled to 50% in card view, full size on detail page</li>
            </ul>
          </div>

          {/* Code Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">
                Code Editor
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs border-[#3A3A3A] text-white hover:border-[#FF9AC9] hover:text-[#FF9AC9] transition-all duration-300"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-black rounded-lg border border-[#3A3A3A]">
              {(["html", "css", "js"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex-1 ${
                    activeTab === tab
                      ? "bg-[#FF9AC9] text-[#282828]"
                      : "text-[#767676] hover:text-white hover:bg-[#3A3A3A]"
                  }`}
                >
                  {getTabIcon(tab)}
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Textarea */}
            <div className="relative">
              <Textarea
                id={activeTab}
                name={activeTab}
                value={form[activeTab]}
                onChange={handleChange}
                rows={8}
                required={activeTab === "html"}
                placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
                className="font-mono text-xs bg-black border border-[#3A3A3A] text-white placeholder:text-[#767676] focus:border-[#FF9AC9] resize-none transition-all duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 bg-[#3A3A3A] text-[#767676] text-[10px] rounded-md font-medium">
                  {activeTab.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Code Stats */}
            <div className="flex gap-4 text-xs text-[#767676]">
              <span>HTML: {form.html.length} chars</span>
              <span>CSS: {form.css.length} chars</span>
              <span>JS: {form.js.length} chars</span>
            </div>

            {/* Live Preview */}
            {showPreview && (form.html || form.css || form.js) && (
              <div className="border border-[#3A3A3A] rounded-lg overflow-hidden">
                <div className="bg-black px-3 py-1.5 text-xs font-medium text-white border-b border-[#3A3A3A]">
                  Live Preview
                </div>
                <div className="bg-black p-4 h-[200px] flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      title="Live Preview"
                      srcDoc={formatCode()}
                      className="w-full h-full border-0"
                      style={{
                        background: 'transparent',
                        transform: 'scale(0.5)',
                        transformOrigin: 'center'
                      }}
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
                <div className="bg-[#1A1A1A] border-t border-[#3A3A3A] px-3 py-1.5 text-[10px] text-[#FF9AC9]">
                  ⚠️ Preview at 50% scale (card view). Full size on detail page.
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <div className="text-red-500 text-xs font-medium">{error}</div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="text-green-500 text-xs font-medium">
                Component uploaded successfully!
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF9AC9] hover:bg-[#ff7eb8] text-[#282828] font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm hover:shadow-[0_0_20px_rgba(255,154,201,0.3)]"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#282828] border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Upload Component
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="px-4 py-2 border-[#3A3A3A] text-white hover:bg-[#3A3A3A] hover:border-[#FF9AC9] text-sm transition-all duration-300"
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminComponentUpload;