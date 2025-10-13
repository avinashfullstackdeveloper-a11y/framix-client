// [`client/src/pages/AdminComponentUpload.tsx`](client/src/pages/AdminComponentUpload.tsx:1)
import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminComponentUpload: React.FC = () => {
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

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Upload New Component
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-800 mb-1 block">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900"
          />
        </div>
        <div>
          <Label htmlFor="type" className="text-gray-800 mb-1 block">
            Type
          </Label>
          <Input
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900"
          />
        </div>
        {/* Dynamic Editor Tabs */}
        <div className="mb-2 flex gap-2">
          <Button
            type="button"
            variant={activeTab === "html" ? "default" : "outline"}
            onClick={() => handleTabChange("html")}
            className={activeTab === "html" ? "bg-primary text-white" : ""}
          >
            HTML
          </Button>
          <Button
            type="button"
            variant={activeTab === "css" ? "default" : "outline"}
            onClick={() => handleTabChange("css")}
            className={activeTab === "css" ? "bg-primary text-white" : ""}
          >
            CSS
          </Button>
          <Button
            type="button"
            variant={activeTab === "js" ? "default" : "outline"}
            onClick={() => handleTabChange("js")}
            className={activeTab === "js" ? "bg-primary text-white" : ""}
          >
            JavaScript
          </Button>
        </div>
        <div>
          {activeTab === "html" && (
            <>
              <Label htmlFor="html" className="text-gray-800 mb-1 block">
                HTML Code
              </Label>
              <Textarea
                id="html"
                name="html"
                value={form.html}
                onChange={handleChange}
                rows={8}
                className="bg-gray-50 border border-gray-300 text-gray-900"
                required={activeTab === "html"}
              />
            </>
          )}
          {activeTab === "css" && (
            <>
              <Label htmlFor="css" className="text-gray-800 mb-1 block">
                CSS Code
              </Label>
              <Textarea
                id="css"
                name="css"
                value={form.css}
                onChange={handleChange}
                rows={8}
                className="bg-gray-50 border border-gray-300 text-gray-900"
                required={activeTab === "css"}
              />
            </>
          )}
          {activeTab === "js" && (
            <>
              <Label htmlFor="js" className="text-gray-800 mb-1 block">
                JavaScript Code
              </Label>
              <Textarea
                id="js"
                name="js"
                value={form.js}
                onChange={handleChange}
                rows={8}
                className="bg-gray-50 border border-gray-300 text-gray-900"
                required={activeTab === "js"}
              />
            </>
          )}
        </div>
        {error && <div className="text-red-500 font-semibold">{error}</div>}
        {success && (
          <div className="text-green-600 font-semibold">
            Component uploaded successfully!
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default AdminComponentUpload;
