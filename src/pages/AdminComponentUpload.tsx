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
    language: "",
    code: "",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let res: Response;
      const jsonBody = {
        title: form.title,
        type: form.type,
        language: form.language,
        code: form.code,
      };
      res = await fetch("/api/components", {
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
        language: "",
        code: "",
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
        <div>
          <Label htmlFor="language" className="text-gray-800 mb-1 block">
            Language
          </Label>
          <Input
            id="language"
            name="language"
            value={form.language}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900"
          />
        </div>
        <div>
          <Label htmlFor="code" className="text-gray-800 mb-1 block">
            Code
          </Label>
          <Textarea
            id="code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            rows={8}
            className="bg-gray-50 border border-gray-300 text-gray-900"
          />
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
