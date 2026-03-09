import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { internships } from "@/data/internships";
import InternshipCard from "@/components/InternshipCard";
import { motion } from "framer-motion";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const { recommendations, savedInternships } = useAppState();
  const navigate = useNavigate();

  const saved = internships.filter((i) => savedInternships.includes(i.id)).map((i) => {
    const rec = recommendations.find((r) => r.id === i.id);
    return rec || { ...i, score: 0, maxScore: 1, matchPercentage: 0, matchedSkills: [], missingSkills: [], reasons: [], successProbability: "Low" as const, scamWarning: false, scamReasons: [] };
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-primary" /> Saved Internships
        </h1>
        <p className="text-sm text-muted-foreground">{saved.length} internship{saved.length !== 1 ? "s" : ""} saved</p>
      </motion.div>

      {saved.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((s, i) => (
            <InternshipCard key={s.id} internship={s} index={i} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground mb-1">No saved internships</h3>
          <p className="text-sm text-muted-foreground mb-4">Tap the heart icon on any internship to save it here.</p>
          <Button onClick={() => navigate("/search")} variant="outline" className="rounded-lg">
            Browse Internships <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
