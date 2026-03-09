import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { getCareerPaths } from "@/lib/recommendation";
import { internships } from "@/data/internships";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareerPathsPage() {
  const { profile } = useAppState();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
          <TrendingUp className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Career Path Predictor</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">Complete your profile to see AI-predicted career paths.</p>
        <Button onClick={() => navigate("/profile")} className="gradient-primary text-primary-foreground rounded-xl px-6 py-5 shadow-glow">
          Complete Profile
        </Button>
      </div>
    );
  }

  const paths = getCareerPaths(profile);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/15 text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3 h-3" /> AI Career Predictor
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Career Paths</h1>
        <p className="text-sm text-muted-foreground">Based on your skills: {profile.skills.slice(0, 3).join(", ")}</p>
      </motion.div>

      {/* Visual flow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-3 mb-8 text-[11px] text-muted-foreground">
        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">Your Skills</span>
        <span>→</span>
        <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-lg font-medium">Internships</span>
        <span>→</span>
        <span className="bg-cyan/10 text-cyan px-3 py-1.5 rounded-lg font-medium">Future Careers</span>
      </motion.div>

      <div className="space-y-4">
        {paths.map((path, i) => {
          const matchPct = path.requiredSkills.length > 0 ? Math.round((path.matchingSkills.length / path.requiredSkills.length) * 100) : 0;
          const color = matchPct >= 60 ? "text-success" : matchPct >= 30 ? "text-warning" : "text-muted-foreground";

          return (
            <motion.div key={path.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-foreground">{path.title}</h3>
                  <p className="text-xs text-muted-foreground">{path.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${color}`}>{matchPct}%</p>
                  <p className="text-[10px] text-muted-foreground">skill match</p>
                </div>
              </div>

              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
                <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }}
                  animate={{ width: `${matchPct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Skills you have</p>
                  <div className="flex flex-wrap gap-1">
                    {path.matchingSkills.map(s => (
                      <span key={s} className="flex items-center gap-0.5 text-[10px] bg-success/8 text-success px-1.5 py-0.5 rounded-md">
                        <CheckCircle className="w-2.5 h-2.5" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">To learn</p>
                  <div className="flex flex-wrap gap-1">
                    {path.missingSkills.slice(0, 4).map(s => (
                      <span key={s} className="flex items-center gap-0.5 text-[10px] bg-warning/8 text-warning px-1.5 py-0.5 rounded-md">
                        <AlertCircle className="w-2.5 h-2.5" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {path.relevantInternships.length > 0 && (
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Related internships</p>
                  {path.relevantInternships.slice(0, 2).map(id => {
                    const intern = internships.find(i => i.id === id);
                    if (!intern) return null;
                    return (
                      <button key={id} onClick={() => navigate(`/internship/${id}`)}
                        className="flex items-center justify-between w-full bg-secondary/50 hover:bg-secondary rounded-lg p-2 mb-1 text-left transition-colors">
                        <span className="text-[11px] font-medium text-foreground">{intern.title} · <span className="text-muted-foreground">{intern.company}</span></span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
