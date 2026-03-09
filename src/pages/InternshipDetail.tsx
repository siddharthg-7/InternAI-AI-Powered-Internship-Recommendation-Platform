import { useParams, useNavigate } from "react-router-dom";
import { internships, SKILL_RESOURCES } from "@/data/internships";
import { useAppState } from "@/context/AppContext";
import { ArrowLeft, MapPin, IndianRupee, Clock, Heart, ExternalLink, CheckCircle, Briefcase, GraduationCap, AlertTriangle, Shield, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recommendations, savedInternships, toggleSaved, profile } = useAppState();

  const internship = internships.find((i) => i.id === id);
  const recommended = recommendations.find((r) => r.id === id);
  const isSaved = savedInternships.includes(id || "");

  if (!internship) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Internship not found.</p>
      </div>
    );
  }

  const diffColor = internship.difficulty === "Beginner" ? "bg-cyan/10 text-cyan" : internship.difficulty === "Intermediate" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive";

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden mb-6"
      >
        <div className="gradient-primary p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary-foreground/20 text-primary-foreground`}>{internship.difficulty}</span>
              {internship.verified && (
                <span className="text-[10px] text-primary-foreground/80 flex items-center gap-1"><Shield className="w-3 h-3" /> Verified</span>
              )}
            </div>
            <button onClick={() => toggleSaved(internship.id)} className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground">
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-primary-foreground">{internship.title}</h1>
              <p className="text-sm text-primary-foreground/80">{internship.company}</p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x divide-border p-4">
          {[
            { icon: MapPin, label: internship.mode === "Remote" ? "Remote" : internship.location, sub: internship.mode },
            { icon: IndianRupee, label: internship.stipend, sub: "Stipend" },
            { icon: Clock, label: internship.duration, sub: "Duration" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={sub} className="text-center px-2">
              <Icon className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scam Warning */}
      {!internship.verified && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-start gap-3 bg-destructive/5 border border-destructive/15 text-destructive rounded-xl p-4 mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-0.5">⚠ Potentially suspicious</p>
            <p className="text-xs opacity-80">This internship has not been verified. Research the company before applying.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* Match + Success */}
          {recommended && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Match Score</p>
                  <p className="text-xl font-bold text-foreground">{recommended.matchPercentage}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">Success Probability</p>
                  <p className={`text-xl font-bold flex items-center gap-1 justify-end ${
                    recommended.successProbability === "High" ? "text-success" : recommended.successProbability === "Medium" ? "text-warning" : "text-destructive"
                  }`}>
                    <Star className="w-4 h-4" /> {recommended.successProbability}
                  </p>
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${recommended.matchPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Why matches */}
          {recommended && recommended.reasons.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <h3 className="font-display font-semibold text-xs text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Why this matches you
              </h3>
              {recommended.reasons.map((r, i) => (
                <p key={i} className="text-xs text-foreground/80 mb-0.5">• {r}</p>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{internship.description}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-foreground mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {internship.requiredSkills.map((s) => {
                const hasSkill = profile?.skills.includes(s);
                return (
                  <span key={s} className={`text-[11px] font-medium px-2.5 py-1 rounded-md ${hasSkill ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground"}`}>
                    {hasSkill && <CheckCircle className="w-3 h-3 inline mr-1" />}{s}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Missing skills */}
          {recommended && recommended.missingSkills.length > 0 && (
            <div className="bg-warning/5 border border-warning/10 rounded-xl p-4">
              <h3 className="font-display font-semibold text-xs text-warning mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Skills to Improve
              </h3>
              <div className="space-y-1.5">
                {recommended.missingSkills.map(s => {
                  const res = SKILL_RESOURCES[s];
                  return (
                    <div key={s} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{s}</span>
                      {res && (
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-medium flex items-center gap-0.5 hover:underline">
                          Learn <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Eligibility */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm text-foreground mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-primary" /> Eligibility
            </h3>
            <p className="text-sm text-muted-foreground">{internship.eligibility}</p>
          </div>
        </div>
      </div>

      {/* Apply */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
        <Button
          onClick={() => window.open(internship.applicationLink, "_blank")}
          className="w-full gradient-primary text-primary-foreground shadow-glow py-5 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Apply Now <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
