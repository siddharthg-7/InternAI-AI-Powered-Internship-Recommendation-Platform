import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import InternshipCard from "@/components/InternshipCard";
import ReadinessScore from "@/components/ReadinessScore";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, TrendingUp, MessageCircle,
  BarChart3, Zap, BookMarked, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const { recommendations, savedInternships, profile } = useAppState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const firstName = user?.displayName?.split(" ")[0] || "there";

  const quickActions = [
    {
      icon: Sparkles,
      label: t("dash.getRec"),
      desc: t("dash.recDesc"),
      path: "/profile",
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      icon: BarChart3,
      label: t("dash.skillAnalysis"),
      desc: t("dash.skillDesc"),
      path: "/skill-gap",
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      icon: TrendingUp,
      label: t("dash.careerPaths"),
      desc: t("dash.careerDesc"),
      path: "/career-paths",
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      icon: MessageCircle,
      label: t("dash.aiAssistant"),
      desc: t("dash.aiDesc"),
      path: "/chat",
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* ── Welcome Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{firstName}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profile ? t("dash.readyMsg") : t("dash.completeProfile")}
        </p>
      </motion.div>

      {/* ── Quick Action Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => navigate(action.path)}
            className="bg-card border border-border rounded-xl p-5 text-left group
                       hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-0.5
                       transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {/* Icon container */}
            <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-4
                             group-hover:scale-105 transition-transform duration-300 shadow-md`}>
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {action.label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {action.desc}
            </p>
          </motion.button>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Top Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-primary" />
                {t("dash.topRec")}
              </h2>
              {recommendations.length > 0 && (
                <button
                  onClick={() => navigate("/recommendations")}
                  className="text-xs text-primary font-semibold flex items-center gap-1
                             hover:gap-2 transition-all hover:underline underline-offset-2"
                >
                  {t("dash.viewAll")} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <InternshipCard key={rec.id} internship={rec} index={i} />
                ))}
              </div>
            ) : (
              /* Empty state — matches reference image */
              <div className="bg-card border border-border rounded-xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15
                                flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary/60" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {t("dash.noRec")}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
                  {t("dash.noRecDesc")}
                </p>
                <Button
                  onClick={() => navigate("/profile")}
                  className="gradient-primary text-white rounded-lg px-6 py-2.5 text-sm font-medium
                             shadow-md hover:shadow-lg hover:opacity-95 transition-all"
                >
                  {t("dash.completeProfileBtn")} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </motion.div>

          {/* Saved Internships section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2 text-base">
                <BookMarked className="w-4 h-4 text-primary" />
                Saved Internships
              </h2>
              <button
                onClick={() => navigate("/saved")}
                className="text-xs text-primary font-semibold hover:underline underline-offset-2"
              >
                View All
              </button>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("dash.savedCount")}</p>
                  <p className="text-xl font-bold text-foreground">{savedInternships.length}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/saved")}
                className="text-xs bg-primary text-white font-medium px-3 py-1.5 rounded-lg
                           hover:bg-primary/90 transition-colors"
              >
                {t("dash.view")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Sidebar widgets */}
        <div className="space-y-4">
          {/* Readiness Score */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ReadinessScore profile={profile} />
            </motion.div>
          )}

          {/* AI Career Assistant CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            onClick={() => navigate("/chat")}
            className="bg-primary rounded-xl p-5 cursor-pointer hover:opacity-95
                       hover:shadow-float transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0
                              group-hover:bg-white/20 transition-colors">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("dash.aiCareer")}</p>
                <p className="text-[11px] text-white/70">{t("dash.aiCareerDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
              Ask a question <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* Quick stats card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="bg-card border border-border rounded-xl p-5 space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Recommendations", value: recommendations.length, color: "bg-primary" },
                { label: "Saved", value: savedInternships.length, color: "bg-primary/60" },
                { label: "Profile", value: profile ? "Complete" : "Pending", color: profile ? "bg-success" : "bg-warning" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
