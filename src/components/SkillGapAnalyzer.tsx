import { SkillGap } from "@/data/internships";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, AlertCircle } from "lucide-react";

interface Props {
  skillGaps: SkillGap[];
}

export default function SkillGapAnalyzer({ skillGaps }: Props) {
  if (skillGaps.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-warning" />
        <h3 className="font-display font-semibold text-sm text-foreground">Skills to Learn</h3>
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">
        Learn these skills to improve your match scores and unlock more opportunities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {skillGaps.map((gap, i) => (
          <motion.div
            key={gap.skill}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between bg-secondary/50 hover:bg-secondary rounded-lg p-3 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-warning" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{gap.skill}</p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{gap.resource}</p>
              </div>
            </div>
            <a
              href={gap.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md bg-primary/8 text-primary hover:bg-primary/15 transition-colors opacity-70 group-hover:opacity-100"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
