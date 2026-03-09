import {
  LayoutDashboard, Sparkles, BarChart3, TrendingUp,
  Bookmark, FileText, MessageCircle, Search,
  Briefcase,
} from "lucide-react";
import { FaUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const ADMIN_EMAIL = "governmentsample@gmail.com";

const mainItems = [
  { titleKey: "nav.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.recommendations", url: "/recommendations", icon: Sparkles },
  { titleKey: "nav.search", url: "/search", icon: Search },
  { titleKey: "nav.skillGap", url: "/skill-gap", icon: BarChart3 },
  { titleKey: "nav.careerPaths", url: "/career-paths", icon: TrendingUp },
  { titleKey: "nav.saved", url: "/saved", icon: Bookmark },
];

const toolItems = [
  { titleKey: "nav.resumeTools", url: "/profile", icon: FileText },
  { titleKey: "nav.aiAssistant", url: "/chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ── Logo Header ── */}
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          {/* Navy logo mark */}
          <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="text-left">
              <span className="font-display font-bold text-sm text-white block leading-none">
                InternAI
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 leading-none">
                Career Intelligence
              </span>
            </div>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* Main Nav */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest mb-1 px-3">
              {t("nav.main")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainItems.map((item) => {
                const cleanPath = location.pathname.replace(/^\/(hi|te)/, "") || "/";
                const isActive = cleanPath === item.url || cleanPath.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-all duration-200 group relative
                          ${isActive
                            ? "bg-white text-primary font-semibold shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                          }`}
                        activeClassName=""
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                        )}
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/70"}`} />
                        {!collapsed && <span>{t(item.titleKey)}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Nav */}
        <SidebarGroup className="mt-2">
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest mb-1 px-3">
              {t("nav.tools")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {toolItems.map((item) => {
                const cleanPath = location.pathname.replace(/^\/(hi|te)/, "") || "/";
                const isActive = cleanPath === item.url;
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-all duration-200 relative
                          ${isActive
                            ? "bg-white text-primary font-semibold shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                          }`}
                        activeClassName=""
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                        )}
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/70"}`} />
                        {!collapsed && <span>{t(item.titleKey)}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        {isAdmin && (
          <SidebarGroup className="mt-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin"
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                        text-sidebar-foreground hover:bg-sidebar-accent hover:text-white
                        transition-all duration-200"
                      activeClassName="bg-white text-primary font-semibold shadow-sm"
                    >
                      <FaUserShield className="w-4 h-4 shrink-0 text-sidebar-foreground/70" />
                      {!collapsed && <span>{t("nav.admin")}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ── Footer: User Profile ── */}
      <SidebarFooter className="p-3 border-t border-sidebar-border/50">
        {user ? (
          <div className="rounded-lg bg-sidebar-accent/60 p-3">
            <button
              onClick={() => navigate("/my-profile")}
              className="flex items-center gap-2.5 mb-2 w-full hover:opacity-85 transition-opacity"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-2 ring-white/20" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <FaUser className="w-3 h-3 text-white" />
                </div>
              )}
              {!collapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                  <p className="text-[10px] text-sidebar-foreground/55 truncate">{user.email}</p>
                </div>
              )}
            </button>
            {!collapsed && (
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-[11px] text-sidebar-foreground/50
                           hover:text-white transition-colors"
              >
                <FaSignOutAlt className="w-3 h-3" /> {t("nav.signOut")}
              </button>
            )}
          </div>
        ) : (
          !collapsed && (
            <div className="rounded-lg bg-sidebar-accent/60 p-3">
              <p className="text-[10px] text-sidebar-foreground/50 mb-0.5">{t("nav.aiPowered")}</p>
              <p className="text-xs font-semibold text-white">{t("nav.smartGuidance")}</p>
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
