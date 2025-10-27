// SettingsPage.tsx
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import PersonalInformation from "./PersonalInformation.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AccountSection } from "./AccountSection.tsx";
  import type { MyComponentSubmission } from "@/components/MyComponentCard";

import StatsSection from "./StatsSection.tsx";
import MyComponentCard from "@/components/MyComponentCard";

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
      id: "mycomponents",
      label: "My Components",
      icon: "https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/724126a735e33b50219fb6953993ef586769d2c3?placeholderIfAbsent=true",
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

  // --- My Components submissions state ---

  const [myComponentsApproved, setMyComponentsApproved] = useState<MyComponentSubmission[]>([]);
  const [myComponentsRejected, setMyComponentsRejected] = useState<MyComponentSubmission[]>([]);
  const [myComponentsPending, setMyComponentsPending] = useState<MyComponentSubmission[]>([]);
  const [loadingMyComponents, setLoadingMyComponents] = useState(false);
  const [myComponentsError, setMyComponentsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyComponents() {
      setLoadingMyComponents(true);
      setMyComponentsError(null);
      try {
        const [approvedRes, rejectedRes, pendingRes] = await Promise.all([
          apiRequest<{ data: MyComponentSubmission[] }>("/api/submissions/my-submissions?status=approved"),
          apiRequest<{ data: MyComponentSubmission[] }>("/api/submissions/my-submissions?status=rejected"),
          apiRequest<{ data: MyComponentSubmission[] }>("/api/submissions/my-submissions?status=pending"),
        ]);
        setMyComponentsApproved(approvedRes.data.filter((item) => item.status === "approved"));
        setMyComponentsRejected(rejectedRes.data.filter((item) => item.status === "rejected"));
        setMyComponentsPending(pendingRes.data.filter((item) => item.status === "pending"));
      } catch (err) {
        setMyComponentsError(
          err instanceof Error ? err.message : "Failed to fetch submissions"
        );
      } finally {
        setLoadingMyComponents(false);
      }
    }

    if (activeSection === "mycomponents") {
      fetchMyComponents();
    }
    // Optionally, clear data when leaving section
    // else {
    //   setMyComponentsApproved([]);
    //   setMyComponentsRejected([]);
    //   setMyComponentsPending([]);
    // }
  }, [activeSection]);

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
        {/* Provide context for editing: store selected component in sessionStorage before navigating */}
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
            {activeSection === "mycomponents" && (
              <section className="h-full">
                <h2 className="text-2xl font-bold mb-4">My Components</h2>
                {/* Top-side tab switch for Approved/Rejected */}
                <TabsMyComponents
                  approved={myComponentsApproved}
                  rejected={myComponentsRejected}
                  loading={loadingMyComponents}
                  error={myComponentsError}
                  navigate={navigate}
                />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Tab Switch Component ---
function TabsMyComponents({
  approved,
  rejected,
  loading,
  error,
  navigate,
}: {
  approved: MyComponentSubmission[];
  rejected: MyComponentSubmission[];
  loading: boolean;
  error: string | null;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [activeTab, setActiveTab] = React.useState<"approved" | "rejected">("approved");

  const tabList = [
    { key: "approved", label: `Approved (${approved.length})` },
    { key: "rejected", label: `Rejected (${rejected.length})` },
  ] as const;

  const submissions = activeTab === "approved" ? approved : rejected;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 border-b-2 ${
              activeTab === tab.key
                ? "border-[#FF9AC9] text-[#FF9AC9] bg-[#23272b]"
                : "border-transparent text-white bg-transparent hover:text-[#FF9AC9]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div>
          {submissions.length === 0 ? (
            <div className="text-gray-400">No submissions found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="cursor-pointer w-full"
                  onClick={() => {
                    navigate(`/component-editor?id=${submission._id}`);
                  }}
                >
                  <MyComponentCard submission={submission} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}