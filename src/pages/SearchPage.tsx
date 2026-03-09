import { useState, useEffect, useCallback } from "react";
import { internships, DOMAINS } from "@/data/internships";
import { searchAdzunaInternships, AdzunaJob } from "@/lib/adzuna";
import { Search as SearchIcon, Filter, X, MapPin, Briefcase, Shield, AlertTriangle, ArrowRight, ExternalLink, Globe, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ domain?: string; mode?: string; difficulty?: string }>({});
  const [activeTab, setActiveTab] = useState<"local" | "live">("local");
  const [liveJobs, setLiveJobs] = useState<AdzunaJob[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveTotal, setLiveTotal] = useState(0);
  const [liveSearched, setLiveSearched] = useState(false);

  const filtered = internships.filter((i) => {
    if (query && !i.title.toLowerCase().includes(query.toLowerCase()) && !i.company.toLowerCase().includes(query.toLowerCase())) return false;
    if (filters.domain && i.domain !== filters.domain) return false;
    if (filters.mode && i.mode !== filters.mode) return false;
    if (filters.difficulty && i.difficulty !== filters.difficulty) return false;
    return true;
  });

  const fetchLiveJobs = useCallback(async (searchQuery: string) => {
    setLiveLoading(true);
    setLiveSearched(true);
    const { results, total } = await searchAdzunaInternships(searchQuery || "");
    setLiveJobs(results);
    setLiveTotal(total);
    setLiveLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "live") {
      const timer = setTimeout(() => fetchLiveJobs(query), 500);
      return () => clearTimeout(timer);
    }
  }, [query, activeTab, fetchLiveJobs]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `₹${Math.round(min).toLocaleString()} - ₹${Math.round(max).toLocaleString()}`;
    if (min) return `₹${Math.round(min).toLocaleString()}+`;
    return `Up to ₹${Math.round(max!).toLocaleString()}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">Search Internships</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab("local")}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "local" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Curated ({filtered.length})
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "live" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Live Jobs {liveSearched && `(${liveTotal})`}
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-card border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary/40 focus-within:shadow-xs transition-all">
            <SearchIcon className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <input type="text" placeholder={activeTab === "live" ? "Search live internships (e.g. data science, marketing)..." : "Search by title or company..."} value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            {query && <button onClick={() => setQuery("")}><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
          {activeTab === "local" && (
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-secondary"}`}>
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>

        {showFilters && activeTab === "local" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-3 bg-card border border-border rounded-xl p-4">
            <FilterSection label="Domain" options={DOMAINS} selected={filters.domain} onSelect={(v) => setFilters({ ...filters, domain: v })} />
            <FilterSection label="Mode" options={["Remote", "Hybrid", "Onsite"]} selected={filters.mode} onSelect={(v) => setFilters({ ...filters, mode: v })} />
            <FilterSection label="Difficulty" options={["Beginner", "Intermediate", "Advanced"]} selected={filters.difficulty} onSelect={(v) => setFilters({ ...filters, difficulty: v })} />
          </motion.div>
        )}
      </motion.div>

      {/* Local results */}
      {activeTab === "local" && (
        <>
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((intern, i) => {
              const diffColor = intern.difficulty === "Beginner" ? "bg-cyan/10 text-cyan" : intern.difficulty === "Intermediate" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive";
              return (
                <motion.div key={intern.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/internship/${intern.id}`)}
                  className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group">
                  {!intern.verified && (
                    <div className="flex items-center gap-1 text-destructive text-[10px] font-semibold mb-2">
                      <AlertTriangle className="w-3 h-3" /> Unverified
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-semibold text-sm text-foreground truncate">{intern.title}</h3>
                        {intern.verified && <Shield className="w-3 h-3 text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{intern.company}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{intern.mode === "Remote" ? "Remote" : intern.location}</span>
                    <span>{intern.stipend}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${diffColor}`}>{intern.difficulty}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Live results */}
      {activeTab === "live" && (
        <>
          {liveLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Searching live internships...</p>
            </div>
          ) : liveJobs.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground mb-4">{liveTotal.toLocaleString()} live results found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveJobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="flex items-center gap-1 text-primary text-[10px] font-semibold mb-2">
                      <Globe className="w-3 h-3" /> Live from Adzuna
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-sm text-foreground truncate">{job.title}</h3>
                        <p className="text-[11px] text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                      </div>
                      <a href={job.redirect_url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline">
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : liveSearched ? (
            <div className="text-center py-16">
              <Globe className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No live internships found. Try a different search.</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function FilterSection({ label, options, selected, onSelect }: { label: string; options: string[]; selected?: string; onSelect: (v?: string) => void }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt} onClick={() => onSelect(selected === opt ? undefined : opt)}
            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
              selected === opt ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary/20"
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  );
}
