// Sidebar navigation component for admin section.
// Lists all admin tabs in the specified order. Reusable across admin pages.

import React from "react";
import { NavLink } from "react-router-dom";

export const adminTabs = [
  { label: "Components", path: "/admin/components" },
  { label: "User Queue", path: "/admin/user-queue" },
  { label: "Upload", path: "/admin/upload" },
  { label: "Blogs", path: "/admin/blogs" },
  { label: "User Profile Management", path: "/admin/user-profile-management" },
  { label: "Payment History", path: "/admin/payment-history" },
  { label: "Bug Report", path: "/admin/bug-report" },
  { label: "Feedback History", path: "/admin/feedback-history" }
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 min-h-screen bg-[rgba(0,0,0,0.80)] border-r border-[#3A3A3A] p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#3A3A3A]">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-xs text-[#767676] mt-1">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          {adminTabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) => 
                  `block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    isActive 
                      ? "bg-[#FF9AC9] border-[#FF9AC9] text-[#282828] shadow-[0_0_20px_rgba(255,154,201,0.3)]" 
                      : "border-transparent text-[#767676] hover:text-white hover:bg-[#3A3A3A] hover:border-[#3A3A3A]"
                  }`
                }
                end
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[#3A3A3A]">
        <p className="text-xs text-[#767676] text-center">
          Admin Portal v1.0
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;