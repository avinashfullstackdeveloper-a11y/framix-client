import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ComponentType,
  TechnologyType,
} from "@/components/ComponentSelectorPopup";
import { CreatorVerificationModal } from "./CreatorVerificationModal";

// Template code for each component type
const getTemplateCode = (
  componentType: ComponentType,
  technology: TechnologyType
): string => {
  const templates: Record<ComponentType, Record<TechnologyType, string>> = {
    button: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <button class="button">Click me!</button>
</body>
</html>`,
      tailwind: `<button class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0">
  Click me!
</button>`,
    },
    toggle: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .toggle-switch {
      position: relative;
      width: 60px;
      height: 34px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #667eea;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }
  </style>
</head>
<body>
  <label class="toggle-switch">
    <input type="checkbox">
    <span class="slider"></span>
  </label>
</body>
</html>`,
      tailwind: `<label class="relative inline-block w-14 h-8 cursor-pointer">
  <input type="checkbox" class="sr-only peer" />
  <div class="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
</label>`,
    },
    checkbox: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .checkbox-wrapper {
      display: inline-block;
    }

    .checkbox {
      position: relative;
      width: 24px;
      height: 24px;
    }

    .checkbox input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 24px;
      width: 24px;
      background-color: #eee;
      border: 2px solid #ddd;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .checkbox:hover input ~ .checkmark {
      background-color: #ccc;
    }

    .checkbox input:checked ~ .checkmark {
      background-color: #667eea;
      border-color: #667eea;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox input:checked ~ .checkmark:after {
      display: block;
    }
  </style>
</head>
<body>
  <label class="checkbox-wrapper">
    <label class="checkbox">
      <input type="checkbox">
      <span class="checkmark"></span>
    </label>
  </label>
</body>
</html>`,
      tailwind: `<label class="flex items-center cursor-pointer">
  <input type="checkbox" class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
  <span class="ml-2 text-gray-700">Check me</span>
</label>`,
    },
    card: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 320px;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .card-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }

    .card-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">This is a beautiful card component with a clean design and smooth hover effects.</p>
  </div>
</body>
</html>`,
      tailwind: `<div class="bg-white rounded-xl shadow-lg p-6 max-w-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
  <h3 class="text-xl font-bold mb-2 text-gray-800">Card Title</h3>
  <p class="text-gray-600 text-sm leading-relaxed">This is a beautiful card component with a clean design and smooth hover effects.</p>
</div>`,
    },
    loader: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
</body>
</html>`,
      tailwind: `<div class="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>`,
    },
    input: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .input-wrapper {
      position: relative;
      width: 300px;
    }

    .input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .input::placeholder {
      color: #999;
    }
  </style>
</head>
<body>
  <div class="input-wrapper">
    <input type="text" class="input" placeholder="Enter text...">
  </div>
</body>
</html>`,
      tailwind: `<input
  type="text"
  placeholder="Enter text..."
  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 placeholder-gray-400"
/>`,
    },
    form: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .form {
      max-width: 400px;
      padding: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      border-color: #667eea;
    }

    .form-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .form-button:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <form class="form">
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-input" placeholder="your@email.com">
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input type="password" class="form-input" placeholder="••••••••">
    </div>
    <button type="submit" class="form-button">Submit</button>
  </form>
</body>
</html>`,
      tailwind: `<form class="max-w-md p-6 bg-white rounded-xl shadow-lg space-y-5">
  <div>
    <label class="block mb-2 font-semibold text-gray-700">Email</label>
    <input type="email" placeholder="your@email.com" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none" />
  </div>
  <div>
    <label class="block mb-2 font-semibold text-gray-700">Password</label>
    <input type="password" placeholder="••••••••" class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none" />
  </div>
  <button type="submit" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all">
    Submit
  </button>
</form>`,
    },
    pattern: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .pattern-container {
      width: 200px;
      height: 200px;
      background:
        repeating-linear-gradient(
          45deg,
          #667eea,
          #667eea 10px,
          #764ba2 10px,
          #764ba2 20px
        );
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="pattern-container"></div>
</body>
</html>`,
      tailwind: `<div class="w-48 h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-xl" style="background-image: repeating-linear-gradient(45deg, #667eea 0, #667eea 10px, #764ba2 10px, #764ba2 20px);"></div>`,
    },
    radio: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .radio-group {
      display: flex;
      gap: 16px;
    }

    .radio-option {
      position: relative;
    }

    .radio-option input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .radio-button {
      display: inline-block;
      width: 24px;
      height: 24px;
      border: 2px solid #ddd;
      border-radius: 50%;
      position: relative;
      cursor: pointer;
      transition: all 0.3s;
    }

    .radio-option:hover .radio-button {
      border-color: #667eea;
    }

    .radio-option input:checked ~ .radio-button {
      border-color: #667eea;
    }

    .radio-button:after {
      content: "";
      position: absolute;
      display: none;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #667eea;
    }

    .radio-option input:checked ~ .radio-button:after {
      display: block;
    }
  </style>
</head>
<body>
  <div class="radio-group">
    <label class="radio-option">
      <input type="radio" name="option" checked>
      <span class="radio-button"></span>
    </label>
    <label class="radio-option">
      <input type="radio" name="option">
      <span class="radio-button"></span>
    </label>
    <label class="radio-option">
      <input type="radio" name="option">
      <span class="radio-button"></span>
    </label>
  </div>
</body>
</html>`,
      tailwind: `<div class="flex gap-4">
  <label class="flex items-center cursor-pointer">
    <input type="radio" name="option" class="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2" checked />
    <span class="ml-2 text-gray-700">Option 1</span>
  </label>
  <label class="flex items-center cursor-pointer">
    <input type="radio" name="option" class="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2" />
    <span class="ml-2 text-gray-700">Option 2</span>
  </label>
  <label class="flex items-center cursor-pointer">
    <input type="radio" name="option" class="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2" />
    <span class="ml-2 text-gray-700">Option 3</span>
  </label>
</div>`,
    },
    tooltip: {
      css: `<!DOCTYPE html>
<html>
<head>
  <style>
    .tooltip-container {
      position: relative;
      display: inline-block;
    }

    .tooltip-button {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .tooltip-text {
      visibility: hidden;
      opacity: 0;
      background-color: #333;
      color: white;
      text-align: center;
      padding: 8px 12px;
      border-radius: 6px;
      position: absolute;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      transition: opacity 0.3s;
      font-size: 14px;
    }

    .tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }

    .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="tooltip-container">
    <button class="tooltip-button">Hover me</button>
    <span class="tooltip-text">This is a tooltip!</span>
  </div>
</body>
</html>`,
      tailwind: `<div class="relative inline-block group">
  <button class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
    Hover me
  </button>
  <span class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm py-2 px-3 rounded-lg absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800">
    This is a tooltip!
  </span>
</div>`,
    },
  };

  return templates[componentType]?.[technology] || "";
};

// Helper function to determine if color is light or dark
const isLightColor = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

// Preset colors for the palette
const presetColors = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f9fafb" },
  { name: "Dark Gray", value: "#1f2937" },
  { name: "Black", value: "#0a0a0a" },
  { name: "Light Blue", value: "#dbeafe" },
  { name: "Blue", value: "#1e40af" },
  { name: "Light Purple", value: "#f3e8ff" },
  { name: "Purple", value: "#6b21a8" },
  { name: "Light Green", value: "#d1fae5" },
  { name: "Green", value: "#065f46" },
];

const ComponentEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const componentType =
    (searchParams.get("component") as ComponentType) || "button";
  const technology =
    (searchParams.get("technology") as TechnologyType) || "css";

  // --- Refactor: Multi-tab for CSS, single editor for Tailwind ---
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [isEditing, setIsEditing] = useState(true);

  // Background color state for preview
  const [backgroundColor, setBackgroundColor] = useState<string>("#0a0a0a");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Modal open state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [modalLocked, setModalLocked] = useState(false);

  useEffect(() => {
    const template = getTemplateCode(componentType, technology);
    if (technology === "css") {
      // Extract HTML and CSS from template
      const htmlMatch = template.match(/<body>([\s\S]*?)<\/body>/);
      const styleMatch = template.match(/<style>([\s\S]*?)<\/style>/);
      const htmlVal = htmlMatch ? htmlMatch[1].trim() : "";
      setHtmlCode(htmlMatch ? htmlMatch[1].trim() : "");
      setCssCode(styleMatch ? styleMatch[1].trim() : "");
    } else if (technology === "tailwind") {
      setTailwindCode(template);
    }
  }, [componentType, technology]);

  // For copy/reset actions
  const getCurrentCode = () => {
    if (technology === "css") {
      return activeTab === "html" ? htmlCode : cssCode;
    }
    return tailwindCode;
  };

  // Editor language
  const getLanguageForEditor = () => {
    if (technology === "css") return activeTab;
    if (technology === "tailwind") return "javascript";
    return "html";
  };

  // Preview logic with custom background color
  const renderPreview = () => {
    const textColor = isLightColor(backgroundColor) ? "#000000" : "#ffffff";

    if (technology === "css") {
      if (!htmlCode && !cssCode) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      const srcDoc = `
        <!DOCTYPE html>
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
                background: ${backgroundColor};
                color: ${textColor};
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                overflow: hidden;
              }
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
          </body>
        </html>
      `;
      return (
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          style={{ background: "transparent" }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    // Tailwind: Render React code with Tailwind CDN
    if (technology === "tailwind") {
      if (!tailwindCode) {
        return (
          <div className="w-full h-full flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">👁️</div>
              <p>No preview available</p>
            </div>
          </div>
        );
      }
      const srcDoc = `
        <!DOCTYPE html>
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
                background: ${backgroundColor};
                color: ${textColor};
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            ${tailwindCode}
          </body>
        </html>
      `;
      return (
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          style={{ background: "transparent" }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    // Fallback
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">👁️</div>
          <p>No preview available</p>
        </div>
      </div>
    );
  };

  // Actions
  const handleCopy = () => {
    const codeToCopy = getCurrentCode();
    console.log("Copy action, code:", codeToCopy);
    navigator.clipboard.writeText(codeToCopy);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
      variant: "default",
    });
  };

  const handleReset = () => {
    const template = getTemplateCode(componentType, technology);
    console.log("Reset action, template:", template);
    if (technology === "css") {
      const htmlMatch = template.match(/<body>([\s\S]*?)<\/body>/);
      const styleMatch = template.match(/<style>([\s\S]*?)<\/style>/);
      setHtmlCode(htmlMatch ? htmlMatch[1].trim() : "");
      setCssCode(styleMatch ? styleMatch[1].trim() : "");
    } else if (technology === "tailwind") {
      setTailwindCode(template);
    }
    toast({
      title: "Reset!",
      description: "Code has been reset to template.",
      variant: "default",
    });
  };

  // Show modal on submit, prevent multiple opens
  const handleSubmit = () => {
    if (!showVerificationModal && !modalLocked) {
      setShowVerificationModal(true);
      setModalLocked(true);
    }
  };

  // Modal close handler
  const handleModalClose = () => {
    setShowVerificationModal(false);
    setModalLocked(false);
  };

  // Modal submit handler
  const handleModalSubmit = async (
    creatorStatus: "original" | "found" | "modified"
  ) => {
    try {
      // Get user token
      const token = localStorage.getItem("token") || "";

      // Prepare submission data
      const submissionData = {
        title: `${componentType} component`,
        componentType: componentType,
        technology: technology,
        htmlCode: technology === "css" ? htmlCode : "",
        cssCode: technology === "css" ? cssCode : "",
        tailwindCode: technology === "tailwind" ? tailwindCode : "",
        creatorStatus: creatorStatus,
      };

      // Submit to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit component");
      }

      setShowVerificationModal(false);
      setModalLocked(false);

      if (toast) {
        toast({
          title: "Submission Successful!",
          description: "Your component has been submitted for review.",
          variant: "default",
        });
      }

      // Optionally navigate back after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setShowVerificationModal(false);
      setModalLocked(false);

      if (toast) {
        toast({
          title: "Submission Failed",
          description:
            error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      } else {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {showVerificationModal && (
        <CreatorVerificationModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          htmlCode={technology === "css" ? htmlCode : undefined}
          cssCode={technology === "css" ? cssCode : undefined}
          tailwindCode={technology === "tailwind" ? tailwindCode : undefined}
          technology={technology}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
              {componentType}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium uppercase">
              {technology}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 capitalize">
            Customize Your {componentType}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Edit the code on the right to customize your component. See the
            changes in real-time on the left.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
              <h3 className="font-semibold">Preview</h3>
              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor }}
                    />
                    <span>Background</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Preset Colors
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color.value}
                            className="w-10 h-10 rounded border-2 hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: color.value,
                              borderColor:
                                backgroundColor === color.value
                                  ? "#8b5cf6"
                                  : "#d1d5db",
                            }}
                            onClick={() => {
                              setBackgroundColor(color.value);
                              setShowColorPicker(false);
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Custom Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="rounded border cursor-pointer"
                          style={{ width: '60px', height: '40px', minWidth: '60px', minHeight: '40px' }}
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-24 px-3 py-2 border rounded text-sm text-black bg-white"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div
              className="flex-1 flex items-center justify-center p-8 overflow-hidden"
              style={{ backgroundColor }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {renderPreview()}
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
              <h3 className="font-semibold">
                {technology === "css"
                  ? `${componentType}.${activeTab}`
                  : `${componentType}.jsx`}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  Copy
                </Button>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Lock" : "Edit"}
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {technology === "css" && (
                <div className="flex border-b bg-muted/50">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "html"
                        ? "bg-background text-purple-700 border-b-2 border-purple-700"
                        : "text-gray-500"
                    }`}
                    onClick={() => {
                      console.log("Switching to HTML tab");
                      setActiveTab("html");
                    }}
                  >
                    HTML
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "css"
                        ? "bg-background text-purple-700 border-b-2 border-purple-700"
                        : "text-gray-500"
                    }`}
                    onClick={() => {
                      console.log("Switching to CSS tab");
                      setActiveTab("css");
                    }}
                  >
                    CSS
                  </button>
                </div>
              )}
              <div className="flex-1">
                {technology === "css" ? (
                  <Editor
                    height="100%"
                    language={getLanguageForEditor()}
                    value={activeTab === "html" ? htmlCode : cssCode}
                    onChange={(value) => {
                      if (activeTab === "html") setHtmlCode(value || "");
                      else setCssCode(value || "");
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      readOnly: !isEditing,
                      wordWrap: "on",
                      lineNumbers: "on",
                      folding: true,
                      lineDecorationsWidth: 1,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                ) : (
                  <Editor
                    height="100%"
                    language={getLanguageForEditor()}
                    value={tailwindCode}
                    onChange={(value) => {
                      setTailwindCode(value || "");
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      readOnly: !isEditing,
                      wordWrap: "on",
                      lineNumbers: "on",
                      folding: true,
                      lineDecorationsWidth: 1,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentEditor;
