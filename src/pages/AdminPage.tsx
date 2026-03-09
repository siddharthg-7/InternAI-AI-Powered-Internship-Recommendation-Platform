import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { FaUsers, FaChartBar, FaSearch, FaComments, FaShieldAlt } from "react-icons/fa";

const ADMIN_EMAIL = "governmentsample@gmail.com";

// Mock analytics data
const stats = [
  { key: "admin.totalUsers", value: "1,247", icon: FaUsers, change: "+12%" },
  { key: "admin.activeToday", value: "89", icon: FaChartBar, change: "+5%" },
  { key: "admin.totalSearches", value: "3,482", icon: FaSearch, change: "+23%" },
  { key: "admin.chatMessages", value: "956", icon: FaComments, change: "+18%" },
];

const recentActivity = [
  { user: "student_123", action: "Completed profile", time: "2 min ago" },
  { user: "student_456", action: "Searched for 'data science internship'", time: "5 min ago" },
  { user: "student_789", action: "Used AI Assistant", time: "8 min ago" },
  { user: "student_012", action: "Saved 3 internships", time: "12 min ago" },
  { user: "student_345", action: "Viewed career paths", time: "15 min ago" },
  { user: "student_678", action: "Uploaded resume", time: "20 min ago" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-destructive/20 rounded-2xl p-8 text-center max-w-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">{t("admin.noAccess")}</h2>
          <p className="text-sm text-muted-foreground">{t("admin.noAccessDesc")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
          {t("admin.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("admin.overview")}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{t(stat.key)}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="font-display font-semibold text-foreground mb-4">{t("admin.recentActivity")}</h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUsers className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.user}</p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
