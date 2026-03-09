import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation } from "react-router-dom";
import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

// Map route paths to page title labels
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/recommendations": "Recommendations",
  "/search": "Search",
  "/skill-gap": "Skill Gap",
  "/career-paths": "Career Paths",
  "/saved": "Saved",
  "/profile": "Resume Tools",
  "/chat": "AI Assistant",
  "/admin": "Admin",
  "/my-profile": "My Profile",
};

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/^\/(hi|te)/, "") || "/";
  if (cleanPath === "/") return <>{children}</>;

  const pageTitle = PAGE_TITLES[cleanPath] ?? "InternAI";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Top Header Bar ── */}
          <header className="h-14 flex items-center justify-between border-b border-border
                              bg-card/80 backdrop-blur-sm sticky top-0 z-40 px-4 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-secondary
                                          rounded-lg p-1.5 transition-all">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <span className="font-display font-semibold text-sm text-foreground hidden sm:block">
                {pageTitle}
              </span>
            </div>

            {/* Center: Search bar (matches reference image) */}
            <div className="flex-1 max-w-sm hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills or roles..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-secondary/60 border border-border
                             rounded-lg text-foreground placeholder:text-muted-foreground
                             focus:outline-none focus:border-primary/40 focus:bg-card
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Bell notification */}
              <button className="w-8 h-8 rounded-lg border border-border bg-card flex items-center
                                  justify-center text-muted-foreground hover:text-foreground
                                  hover:bg-secondary transition-all relative"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </header>

          {/* ── Page Content ── */}
          <main className="flex-1 page-enter">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
