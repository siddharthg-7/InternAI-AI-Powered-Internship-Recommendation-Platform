import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import InternshipCard from "@/components/InternshipCard";
import ReadinessScore from "@/components/ReadinessScore";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, MessageCircle, BarChart3, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { recommendations, savedInternships, profile } = useAppState();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    { icon: Sparkles, label: t("dash.getRec"), desc: t("dash.recDesc"), path: "/profile", color: "from-primary to-accent" },
    { icon: BarChart3, label: t("dash.skillAnalysis"), desc: t("dash.skillDesc"), path: "/skill-gap", color: "from-cyan to-primary" },
    { icon: TrendingUp, label: t("dash.careerPaths"), desc: t("dash.careerDesc"), path: "/career-paths", color: "from-accent to-primary" },
    { icon: MessageCircle, label: t("dash.aiAssistant"), desc: t("dash.aiDesc"), path: "/chat", color: "from-primary to-cyan" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
          {t("dash.welcome")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {profile ? t("dash.readyMsg") : t("dash.completeProfile")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-card border border-border rounded-xl p-4 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:shadow-glow transition-shadow`}>
              <action.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
            <p className="text-[11px] text-muted-foreground">{action.desc}</p>
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> {t("dash.topRec")}
              </h2>
              {recommendations.length > 0 && (
                <button onClick={() => navigate("/recommendations")} className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
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
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{t("dash.noRec")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("dash.noRecDesc")}</p>
                <Button onClick={() => navigate("/profile")} className="gradient-primary text-primary-foreground rounded-lg px-5 py-4 text-sm">
                  {t("dash.completeProfileBtn")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          {profile && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <ReadinessScore profile={profile} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("dash.savedCount")}</p>
                <p className="text-2xl font-bold text-foreground">{savedInternships.length}</p>
              </div>
              <button onClick={() => navigate("/saved")} className="text-xs text-primary font-medium hover:underline">{t("dash.view")}</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/8 to-accent/8 border border-primary/10 rounded-xl p-5 cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => navigate("/chat")}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t("dash.aiCareer")}</p>
                <p className="text-[11px] text-muted-foreground">{t("dash.aiCareerDesc")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
