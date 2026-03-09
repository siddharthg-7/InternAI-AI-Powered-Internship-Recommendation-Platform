import { StudentProfile } from "@/data/internships";
import { getReadinessScore } from "@/lib/recommendation";
import { motion } from "framer-motion";
import { Gauge, Lightbulb } from "lucide-react";

interface Props {
  profile: StudentProfile;
  compact?: boolean;
}

export default function ReadinessScore({ profile, compact }: Props) {
  const { total, breakdown, suggestions } = getReadinessScore(profile);

  const color = total >= 70 ? "text-success" : total >= 40 ? "text-warning" : "text-destructive";
  const strokeColor = total >= 70 ? "stroke-success" : total >= 40 ? "stroke-warning" : "stroke-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl border border-border shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-foreground">Internship Readiness</h3>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-[72px] h-[72px] shrink-0">
          <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" className="stroke-secondary" strokeWidth="5" />
            <motion.circle
              cx="36" cy="36" r="30" fill="none"
              className={strokeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(total / 100) * 188.5} 188.5`}
              initial={{ strokeDasharray: "0 188.5" }}
              animate={{ strokeDasharray: `${(total / 100) * 188.5} 188.5` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${color}`}>{total}</span>
            <span className="text-[8px] text-muted-foreground">/100</span>
          </div>
        </div>

        {!compact && (
          <div className="flex-1 space-y-2">
            {breakdown.map(({ label, score, max }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{score}/{max}</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!compact && suggestions.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-primary mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3" /> Tips to improve
          </p>
          {suggestions.map((s, i) => (
            <p key={i} className="text-[11px] text-muted-foreground mb-0.5">• {s}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
