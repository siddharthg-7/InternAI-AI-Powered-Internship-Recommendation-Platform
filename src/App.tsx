import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import DashboardLayout from "@/components/DashboardLayout";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import ProfileForm from "./pages/ProfileForm";
import RecommendationsPage from "./pages/RecommendationsPage";
import InternshipDetail from "./pages/InternshipDetail";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import CareerPathsPage from "./pages/CareerPathsPage";
import ChatPage from "./pages/ChatPage";
import SkillGapPage from "./pages/SkillGapPage";
import SavedPage from "./pages/SavedPage";
import MyProfilePage from "./pages/MyProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** All app routes — rendered both at root and under /:lang prefix */
function AppRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/internship/:id" element={<InternshipDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/career-paths" element={<CareerPathsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/skill-gap" element={<SkillGapPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Language-prefixed URLs: /hi/*, /te/* */}
                  <Route path="/hi/*" element={<AppRoutes />} />
                  <Route path="/te/*" element={<AppRoutes />} />
                  {/* Default English routes */}
                  <Route path="/*" element={<AppRoutes />} />
                </Routes>
                <FloatingActionButton />
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
