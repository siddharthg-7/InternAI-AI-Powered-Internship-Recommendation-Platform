import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, BookOpen, Wrench, Target, MapPin, Briefcase, CheckCircle, Award, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentProfile, ALL_SKILLS, DOMAINS, EDUCATION_LEVELS } from "@/data/internships";
import { getRecommendations } from "@/lib/recommendation";
import { useAppState } from "@/context/AppContext";

const STEPS = [
  { icon: GraduationCap, title: "Education", desc: "What's your education level?" },
  { icon: BookOpen, title: "Field of Study", desc: "What are you studying?" },
  { icon: Wrench, title: "Skills", desc: "Select your skills" },
  { icon: Target, title: "Interest", desc: "What career interests you?" },
  { icon: MapPin, title: "Location", desc: "Work preference?" },
  { icon: Briefcase, title: "Experience", desc: "Your experience level?" },
  { icon: FolderKanban, title: "Projects", desc: "How many projects have you done?" },
  { icon: Award, title: "Certifications", desc: "How many certifications?" },
];

const FIELDS_OF_STUDY = [
  "Computer Science", "Information Technology", "Electronics", "Mechanical",
  "Civil", "Business Administration", "Commerce", "Arts", "Science", "Design", "Other",
];

export default function ProfileForm() {
  const navigate = useNavigate();
  const { setProfile, setRecommendations } = useAppState();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<StudentProfile> & { projects?: number; certifications?: number }>({
    skills: [], projects: 0, certifications: 0,
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.education;
      case 1: return !!form.fieldOfStudy;
      case 2: return (form.skills?.length || 0) > 0;
      case 3: return !!form.interest;
      case 4: return !!form.location;
      case 5: return !!form.experience;
      case 6: case 7: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const profile: StudentProfile = {
        education: form.education!, fieldOfStudy: form.fieldOfStudy!, skills: form.skills!,
        interest: form.interest!, location: form.location!, experience: form.experience!,
        projects: form.projects || 0, certifications: form.certifications || 0,
      };
      setProfile(profile);
      setRecommendations(getRecommendations(profile));
      navigate("/recommendations");
    }
  };

  const toggleSkill = (skill: string) => {
    const skills = form.skills || [];
    setForm({ ...form, skills: skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill] });
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <OptionGrid items={EDUCATION_LEVELS} selected={form.education} onSelect={(v) => setForm({ ...form, education: v })} />;
      case 1: return <OptionGrid items={FIELDS_OF_STUDY} selected={form.fieldOfStudy} onSelect={(v) => setForm({ ...form, fieldOfStudy: v })} />;
      case 2: return (
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map(s => (
            <button key={s} onClick={() => toggleSkill(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                form.skills?.includes(s) ? "bg-primary text-primary-foreground border-primary shadow-glow" : "bg-card text-foreground border-border hover:border-primary/30"
              }`}>
              {form.skills?.includes(s) && <CheckCircle className="w-3 h-3 inline mr-1" />}{s}
            </button>
          ))}
        </div>
      );
      case 3: return <OptionGrid items={DOMAINS} selected={form.interest} onSelect={(v) => setForm({ ...form, interest: v })} cols={1} />;
      case 4: return <OptionGrid items={["Remote", "City", "Any"]} selected={form.location} labels={{ Remote: "🏠 Remote", City: "🏙️ City / Onsite", Any: "🌍 Any Location" }} onSelect={(v) => setForm({ ...form, location: v as any })} cols={1} />;
      case 5: return <OptionGrid items={["Beginner", "Intermediate"]} selected={form.experience} labels={{ Beginner: "🌱 Beginner — Just starting", Intermediate: "⚡ Intermediate — Some experience" }} onSelect={(v) => setForm({ ...form, experience: v as any })} cols={1} />;
      case 6: return <OptionGrid items={[0, 1, 2, 3, 5].map(String)} selected={String(form.projects)} labels={{ "0": "🚫 None yet", "1": "📁 1 project", "2": "📁 2 projects", "3": "📁 3 projects", "5": "🚀 5+ projects" }} onSelect={(v) => setForm({ ...form, projects: Number(v) })} cols={1} />;
      case 7: return <OptionGrid items={[0, 1, 2, 3, 5].map(String)} selected={String(form.certifications)} labels={{ "0": "🚫 None yet", "1": "🎓 1 cert", "2": "🎓 2 certs", "3": "🎓 3 certs", "5": "🏆 5+ certs" }} onSelect={(v) => setForm({ ...form, certifications: Number(v) })} cols={1} />;
    }
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="max-w-xl mx-auto p-6 min-h-[calc(100vh-3.5rem)]">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate("/")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Back" : "Home"}
          </button>
          <span className="text-xs text-muted-foreground">Step {step + 1}/{STEPS.length}</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">{STEPS[step].title}</h2>
              <p className="text-sm text-muted-foreground">{STEPS[step].desc}</p>
            </div>
          </div>
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <div className="mt-8">
        <Button onClick={handleNext} disabled={!canProceed()}
          className="w-full gradient-primary text-primary-foreground shadow-glow py-5 text-sm font-semibold rounded-xl disabled:opacity-40">
          {step === STEPS.length - 1 ? "Get My Recommendations" : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function OptionGrid({ items, selected, onSelect, labels, cols = 2 }: {
  items: string[]; selected?: string; onSelect: (v: string) => void; labels?: Record<string, string>; cols?: number;
}) {
  return (
    <div className={`grid gap-2 ${cols === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {items.map(item => (
        <button key={item} onClick={() => onSelect(item)}
          className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
            selected === item ? "bg-primary/8 text-primary border-primary shadow-xs" : "bg-card text-foreground border-border hover:border-primary/20"
          }`}>
          {selected === item && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
          {labels?.[item] || item}
        </button>
      ))}
    </div>
  );
}
