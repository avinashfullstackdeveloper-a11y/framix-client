// Sidebar navigation component for admin section.
// Lists all admin tabs in the specified order. Reusable across admin pages.

import React from "react";
import { NavLink } from "react-router-dom";

export const adminTabs = [
  { label: "Components", path: "/admin/components" },
  { label: "Admin Queue", path: "/admin/admin-queue" },
  { label: "Upload", path: "/admin/upload" },
  { label: "Blogs", path: "/admin/blogs" },
  { label: "User Profile Management", path: "/admin/user-profile-management" },
  { label: "Payment History", path: "/admin/payment-history" },
  { label: "Bug Report", path: "/admin/bug-report" },
  { label: "Feedback History", path: "/admin/feedback-history" },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="bg-[rgba(0,0,0,0.80)] border-b border-[#3A3A3A] p-2 flex flex-col gap-2 w-full max-w-full md:gap-6 md:border-b-0 md:border-r md:w-64 md:min-h-screen md:p-8 md:flex-col">
      {/* Header (hidden on mobile, shown on md+) */}
      <div className="hidden md:block pb-4 border-b border-[#3A3A3A]">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-xs text-[#767676] mt-1">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav>
        <ul
          className="flex flex-row w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#3A3A3A] md:flex-col md:space-y-2 md:overflow-visible"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {adminTabs.map((tab) => (
            <li
              key={tab.path}
              className="flex-shrink-0 w-auto min-w-[120px] md:min-w-0 md:w-full"
            >
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `block px-2 py-2 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border whitespace-nowrap text-center ${
                    isActive
                      ? "bg-[#FF479C] border-[#FF479C] text-[#282828] shadow-[0_0_20px_rgba(255,154,201,0.3)]"
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

      {/* Footer (hidden on mobile, shown on md+) */}
      <div className="hidden md:block mt-auto pt-4 border-t border-[#3A3A3A]">
        <p className="text-xs text-[#767676] text-center">Admin Portal v1.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
