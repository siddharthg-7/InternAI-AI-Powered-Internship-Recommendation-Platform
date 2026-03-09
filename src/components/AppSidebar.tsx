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
      <SidebarHeader className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-sm text-sidebar-accent-foreground">
              InternAI
            </span>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider mb-1">{t("nav.main")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider mb-1">{t("nav.tools")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin link - only for admin user */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin"
                      end
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <FaUserShield className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{t("nav.admin")}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {user ? (
          <div className="bg-sidebar-accent rounded-lg p-3">
            <button
              onClick={() => navigate("/my-profile")}
              className="flex items-center gap-2 mb-2 w-full hover:opacity-80 transition-opacity"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <FaUser className="w-3 h-3 text-primary" />
                </div>
              )}
              {!collapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.displayName}</p>
                  <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
                </div>
              )}
            </button>
            {!collapsed && (
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-[11px] text-sidebar-foreground/60 hover:text-sidebar-accent-foreground transition-colors"
              >
                <FaSignOutAlt className="w-3 h-3" /> {t("nav.signOut")}
              </button>
            )}
          </div>
        ) : (
          !collapsed && (
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="text-[10px] text-sidebar-foreground/60 mb-1">{t("nav.aiPowered")}</p>
              <p className="text-xs font-medium text-sidebar-accent-foreground">{t("nav.smartGuidance")}</p>
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
