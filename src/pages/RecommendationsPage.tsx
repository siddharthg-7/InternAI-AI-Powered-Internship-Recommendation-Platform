import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import InternshipCard from "@/components/InternshipCard";
import SkillGapAnalyzer from "@/components/SkillGapAnalyzer";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSkillGaps } from "@/lib/recommendation";

export default function RecommendationsPage() {
  const { recommendations, profile } = useAppState();
  const navigate = useNavigate();

  if (!profile || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">No recommendations yet</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">Complete your profile first to get personalized AI matches.</p>
        <Button onClick={() => navigate("/profile")} className="gradient-primary text-primary-foreground rounded-xl px-6 py-5 shadow-glow">
          Complete Profile
        </Button>
      </div>
    );
  }

  const skillGaps = getSkillGaps(profile, recommendations);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" /> AI Recommendations
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">Your Top Matches</h1>
            <p className="text-sm text-muted-foreground">
              Based on {profile.skills.slice(0, 2).join(", ")} and {profile.interest}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/career-paths")} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Career Paths">
              <TrendingUp className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/profile")} className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recommendations.map((rec, i) => (
          <InternshipCard key={rec.id} internship={rec} index={i} />
        ))}
      </div>

      {skillGaps.length > 0 && <SkillGapAnalyzer skillGaps={skillGaps} />}
    </div>
  );
}
