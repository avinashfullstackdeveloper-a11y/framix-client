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
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#f8f9fa",
        borderRight: "1px solid #e5e7eb",
        padding: "2rem 1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {adminTabs.map((tab) => (
            <li key={tab.path} style={{ marginBottom: "0.5rem" }}>
              <NavLink
                to={tab.path}
                style={({ isActive }) => ({
                  display: "block",
                  padding: "0.75rem 1rem",
                  borderRadius: 6,
                  color: isActive ? "#fff" : "#222",
                  background: isActive ? "#2563eb" : "transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  transition: "background 0.15s"
                })}
                end
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;