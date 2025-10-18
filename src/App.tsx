import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Components from "./pages/Components";
import Blogs from "./pages/Blogs";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminComponentUpload from "./pages/AdminComponentUpload";
import ComponentDetail from "./pages/ComponentDetail";
import Favourite from "./pages/Favourite";
import Community from "./pages/Community";
import Templates from "./pages/Template";
import TemplateDetail from "./pages/TemplateDetail";
import ReportBug from "./pages/ReportBug";
import { CommunityUserProfile } from "./components/CommunityUserProfile";
import ComponentEditor from "./pages/ComponentEditor";
import AdminRoutes from "./pages/admin/AdminRoutes";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/components" element={<Components />} />
            <Route path="/components/:type/:id" element={<ComponentDetail />} />
            <Route path="/component-editor" element={<ComponentEditor />} />
            <Route path="/admin-component-upload" element={
              <ProtectedRoute>
                <AdminComponentUpload />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/community" element={<Community />} />
// Community user profile route

<Route path="/community/:username" element={<CommunityUserProfile />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings/personal" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/favourite" element={
              <ProtectedRoute>
                <Favourite />
              </ProtectedRoute>
            } />
            <Route path="/settings/favourite" element={
              <ProtectedRoute>
                <Favourite />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/report-bug" element={<ReportBug />} />
            {/* Admin Panel Route */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
