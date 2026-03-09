import { RecommendedInternship } from "@/data/internships";
import { Briefcase, MapPin, IndianRupee, Heart, Zap, CheckCircle, AlertTriangle, Shield, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { motion } from "framer-motion";

interface Props {
  internship: RecommendedInternship;
  index?: number;
}

export default function InternshipCard({ internship, index = 0 }: Props) {
  const navigate = useNavigate();
  const { savedInternships, toggleSaved } = useAppState();
  const isSaved = savedInternships.includes(internship.id);

  const scoreColor = internship.matchPercentage >= 70
    ? "text-success"
    : internship.matchPercentage >= 40
    ? "text-warning"
    : "text-muted-foreground";

  const progressColor = internship.matchPercentage >= 70
    ? "bg-success"
    : internship.matchPercentage >= 40
    ? "bg-warning"
    : "bg-muted-foreground";

  const probBg = internship.successProbability === "High" ? "bg-success/10 text-success" : internship.successProbability === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
  const diffColor = internship.difficulty === "Beginner" ? "bg-cyan/10 text-cyan" : internship.difficulty === "Intermediate" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 p-5 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/internship/${internship.id}`)}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

      {/* Scam Warning */}
      {internship.scamWarning && (
        <div className="relative flex items-center gap-2 bg-destructive/8 border border-destructive/15 text-destructive text-xs font-medium px-3 py-2 rounded-lg mb-3">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Potentially suspicious listing</span>
        </div>
      )}

      <div className="relative flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 group-hover:shadow-glow transition-shadow duration-300">
            <Briefcase className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-semibold text-foreground text-sm leading-tight">{internship.title}</h3>
              {internship.verified && <Shield className="w-3.5 h-3.5 text-primary shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{internship.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSaved(internship.id); }}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Tags */}
      <div className="relative flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${diffColor}`}>{internship.difficulty}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${probBg}`}>
          <Star className="w-2.5 h-2.5 inline mr-0.5 -mt-px" /> {internship.successProbability}
        </span>
      </div>

      {/* Match Score Bar */}
      <div className="relative mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${scoreColor}`} />
            <span className={`text-xs font-semibold ${scoreColor}`}>{internship.matchPercentage}% Match</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progressColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${internship.matchPercentage}%` }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="relative flex flex-wrap gap-1.5 mb-3">
        {internship.matchedSkills.slice(0, 3).map((skill) => (
          <span key={skill} className="flex items-center gap-1 text-[11px] font-medium bg-primary/8 text-primary px-2 py-0.5 rounded-md">
            <CheckCircle className="w-3 h-3" /> {skill}
          </span>
        ))}
        {internship.missingSkills.length > 0 && (
          <span className="text-[11px] font-medium bg-warning/8 text-warning px-2 py-0.5 rounded-md">
            +{internship.missingSkills.length} to learn
          </span>
        )}
      </div>

      {/* Info */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {internship.mode === "Remote" ? "Remote" : internship.location}</span>
          <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {internship.stipend}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}
