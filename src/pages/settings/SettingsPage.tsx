// SettingsPage.tsx
import React, { useState } from "react";
import PersonalInformation from "./PersonalInformation.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AccountSection } from "./AccountSection.tsx";

import StatsSection from "./StatsSection.tsx";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
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
    <aside className="max-md:w-full md:min-h-[600px] md:w-64 md:flex-shrink-0 bg-[#181818] whitespace-nowrap max-md:border-b md:border-r border-neutral-800 max-md:pr-0 md:pr-0.5">
      <div className="w-full max-md:px-4 max-md:py-3 md:px-3 md:py-2">
        <div className="w-full text-lg text-[rgba(242,242,242,1)] font-semibold tracking-[-0.45px] leading-loose max-md:hidden md:px-4">
          <div>Settings</div>
        </div>
        <nav className="w-full text-sm text-[rgba(153,153,153,1)] font-medium leading-none max-md:mt-0 md:mt-2 max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:pb-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-2 max-md:flex-shrink-0 max-md:px-4 max-md:py-2 md:w-full md:mt-1 md:px-4 md:py-2 rounded-md transition-colors ${
                activeSection === section.id
                  ? "bg-[rgba(33,33,33,1)] text-[rgba(230,230,230,1)]"
                  : "hover:bg-[rgba(33,33,33,1)] hover:text-[rgba(230,230,230,1)]"
              }`}
            >
              <img
                src={section.icon}
                className="aspect-[1] object-contain w-4 flex-shrink-0"
                alt={section.label}
              />
              <div className="whitespace-nowrap">{section.label}</div>
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
      <div className="max-md:px-4 max-md:pt-4 md:px-8 md:pt-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          className="bg-transparent text-white border-none font-bold max-md:text-base md:text-lg hover:bg-transparent hover:scale-105 transition-transform p-2"
        >
          ← Go Back
        </Button>
      </div>
      <div className="max-md:flex-col md:flex max-md:px-4 max-md:pb-4 md:px-8 md:pb-8">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 max-md:mt-4 md:pl-8 md:min-h-[600px]">
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
                <StatsSection />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}