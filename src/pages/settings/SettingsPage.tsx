// SettingsPage.tsx
import React, { useState } from "react";
import PersonalInformation from "./PersonalInformation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AccountSection } from "./AccountSection";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/03fa1ede0e9d818a919645c56d91ef4f39b62fbf?placeholderIfAbsent=true",
    },
    {
      id: "account",
      label: "Account",
      icon: "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/e1cc128f320e2b7a88442bf103ca4680c02cf522?placeholderIfAbsent=true",
    },
    {
      id: "stats",
      label: "Stats",
      icon: "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/724126a735e33b50219fb6953993ef586769d2c3?placeholderIfAbsent=true",
    },
  ];

  return (
    <aside className="min-h-[600px] w-64 flex-shrink-0 bg-[#181818] whitespace-nowrap pr-0.5 border-r border-neutral-800">
      <div className="w-full px-3 py-2">
        <div className="w-full text-lg text-[rgba(242,242,242,1)] font-semibold tracking-[-0.45px] leading-loose px-4">
          <div>Settings</div>
        </div>
        <nav className="w-full text-sm text-[rgba(153,153,153,1)] font-medium leading-none mt-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex w-full items-center gap-2 mt-1 px-4 py-2 rounded-md transition-colors ${
                activeSection === section.id
                  ? "bg-[rgba(33,33,33,1)] text-[rgba(230,230,230,1)]"
                  : "hover:bg-[rgba(33,33,33,1)] hover:text-[rgba(230,230,230,1)]"
              }`}
            >
              <img
                src={section.icon}
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt={section.label}
              />
              <div className="self-stretch my-auto">{section.label}</div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Go Back Button */}
      <div className="px-8 pt-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          className="bg-transparent text-white border-none font-bold text-lg hover:bg-transparent hover:scale-105 transition-transform p-2"
        >
          ← Go Back
        </Button>
      </div>
      <div className="flex px-8 pb-8">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 pl-8 min-h-[600px]">
          <div className="h-full">
            {activeSection === "profile" && (
              <section className="h-full">
                <PersonalInformation />
              </section>
            )}
            {activeSection === "account" && (
              <section className="h-full">
                <AccountSection />
              </section>
            )}
            {activeSection === "stats" && (
              <section className="h-full">
                <div className="max-w-3xl mx-auto space-y-8 h-full flex flex-col justify-center">
                  <h2 className="text-2xl font-semibold mb-4">Stats</h2>
                  <p className="text-neutral-400">
                    Stats section (dummy content)
                  </p>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}