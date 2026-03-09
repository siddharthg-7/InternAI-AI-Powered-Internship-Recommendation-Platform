import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { getSkillGaps } from "@/lib/recommendation";
import SkillGapAnalyzer from "@/components/SkillGapAnalyzer";
import ReadinessScore from "@/components/ReadinessScore";
import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkillGapPage() {
  const { recommendations, profile } = useAppState();
  const navigate = useNavigate();

  if (!profile || recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Skill Analysis</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">Complete your profile to see skill gaps and readiness score.</p>
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
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Skill Analysis</h1>
        <p className="text-sm text-muted-foreground">Your readiness score and skill gaps</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ReadinessScore profile={profile} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Skill bars */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Your Skills
            </h3>
            <div className="space-y-3">
              {profile.skills.slice(0, 8).map((skill, i) => {
                // Simulated proficiency
                const proficiency = 60 + Math.round(Math.random() * 35);
                return (
                  <div key={skill}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-foreground font-medium">{skill}</span>
                      <span className="text-muted-foreground">{proficiency}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${proficiency}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {skillGaps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <SkillGapAnalyzer skillGaps={skillGaps} />
        </motion.div>
      )}
    </div>
  );
}
