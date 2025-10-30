// Central routing for admin section. Maps sidebar tabs to their respective page components.
// Placeholder only: no UI or logic implemented.

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ComponentsPage from "./components/ComponentsPage";
import UploadPage from "./Upload/UploadPage";
import BlogsPage from "./Blogs/BlogsPage";
import UserProfileManagementPage from "./UserProfileManagement/UserProfileManagementPage";
import PaymentHistoryPage from "./PaymentHistory/PaymentHistoryPage";
import BugReportPage from "./BugReport/BugReportPage";
import FeedbackHistoryPage from "./FeedbackHistory/FeedbackHistoryPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminQueue from "@/pages/admin/AdminQueue/AdminQueue";

import { ProtectedRoute } from "@/components/ProtectedRoute";

const AdminRoutes: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 w-full max-w-full px-2 py-4 md:px-8 md:py-8 overflow-x-auto">
        <Routes>
          <Route
            path="components"
            element={
              <ProtectedRoute>
                <ComponentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-queue"
            element={
              <ProtectedRoute>
                <AdminQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="blogs"
            element={
              <ProtectedRoute>
                <BlogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-profile-management"
            element={
              <ProtectedRoute>
                <UserProfileManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-history"
            element={
              <ProtectedRoute>
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="bug-report"
            element={
              <ProtectedRoute>
                <BugReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="feedback-history"
            element={
              <ProtectedRoute>
                <FeedbackHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="" element={<Navigate to="components" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoutes;
