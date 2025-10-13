import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Components from "./pages/Components";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ProjectDetail from "./pages/ProjectDetail";
// import ComponentDetail from "./pages/ComponentDetail";
import PersonalInformation from "./pages/PersonalInformation";
import NotFound from "./pages/NotFound";
import AdminComponentUpload from "./pages/AdminComponentUpload";
import ComponentDetail from "./pages/ComponentDetail";
import Favourite from "./pages/Favourite";

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
            <Route path="/components" element={
              <ProtectedRoute>
                <Components />
              </ProtectedRoute>
            } />
            <Route path="/components/:type/:id" element={
              <ProtectedRoute>
                <ComponentDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin-component-upload" element={
              <ProtectedRoute>
                <AdminComponentUpload />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings/personal" element={
              <ProtectedRoute>
                <PersonalInformation />
              </ProtectedRoute>
            } />
            <Route path="/favourite" element={
              <ProtectedRoute>
                <Favourite />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
