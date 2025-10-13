import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Upload, Code, FileText, Palette, Settings2, X } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Determine if multiple code fields are filled
      const codeFields = [form.html, form.css, form.js].filter(Boolean);
      const multiLang = codeFields.length > 1;
      const jsonBody = {
        title: form.title,
        type: form.type,
        language: multiLang ? "multi" : form.language,
        code: multiLang
          ? `${form.html}\n<style>${form.css}</style>\n<script>${form.js}</script>`
          : form.html || form.css || form.js,
        html: form.html,
        css: form.css,
        js: form.js,
      };
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
      });

      if (!res.ok) {
        throw new Error("Failed to upload component");
      }

      setSuccess(true);
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred");
      }
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
    <div className="w-full max-w-3xl mx-auto bg-background rounded-xl shadow-card border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-primary p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Upload New Component
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Add a new component to the showcase
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearForm}
            className="text-foreground hover:bg-muted/40 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-destructive transition-transform hover:scale-110" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-7 bg-card">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Component Title
            </Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., Animated Button"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Component Type
            </Label>
            <Input
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              placeholder="e.g., Button, Card, Navbar"
              className="w-full"
            />
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Code Editor
          </Label>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["html", "css", "js"] as const).map((tab) => (
              <Button
                key={tab}
                type="button"
                variant="ghost"
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {getTabIcon(tab)}
                {tab.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Code Textarea */}
          <div className="relative">
            <Textarea
              id={activeTab}
              name={activeTab}
              value={form[activeTab]}
              onChange={handleChange}
              rows={10}
              required={activeTab === "html"}
              placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
              className="font-mono text-sm bg-background border border-border focus:border-primary resize-none shadow-sm"
            />
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md font-medium">
                {activeTab.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Code Stats */}
          <div className="flex gap-4 text-xs text-gray-500">
            <span>HTML: {form.html.length} chars</span>
            <span>CSS: {form.css.length} chars</span>
            <span>JS: {form.js.length} chars</span>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="text-red-700 text-sm font-medium">{error}</div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-primary/10 border border-primary rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="text-green-700 text-sm font-medium">
              Component uploaded successfully!
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Component
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminComponentUpload;
