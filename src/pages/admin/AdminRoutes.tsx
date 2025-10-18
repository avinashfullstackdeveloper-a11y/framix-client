// Central routing for admin section. Maps sidebar tabs to their respective page components.
// Placeholder only: no UI or logic implemented.

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ComponentsPage from "./components/ComponentsPage";
import UserQueuePage from "./UserQueue/UserQueuePage";
import UploadPage from "./Upload/UploadPage";
import BlogsPage from "./Blogs/BlogsPage";
import UserProfileManagementPage from "./UserProfileManagement/UserProfileManagementPage";
import PaymentHistoryPage from "./PaymentHistory/PaymentHistoryPage";
import BugReportPage from "./BugReport/BugReportPage";
import FeedbackHistoryPage from "./FeedbackHistory/FeedbackHistoryPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminQueue from "@/pages/AdminQueue";

import { ProtectedRoute } from "@/components/ProtectedRoute";

const AdminRoutes: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
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
            path="user-queue"
            element={
              <ProtectedRoute>
                <UserQueuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="submission-queue"
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