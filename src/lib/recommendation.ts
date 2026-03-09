import { StudentProfile, Internship, RecommendedInternship, SkillGap, CareerPath, internships, SKILL_RESOURCES, CAREER_PATHS } from "@/data/internships";

function getSkillScore(studentSkills: string[], internshipSkills: string[]): { score: number; matched: string[]; missing: string[] } {
  const matched = studentSkills.filter(s =>
    internshipSkills.some(is => is.toLowerCase() === s.toLowerCase())
  );
  const missing = internshipSkills.filter(is =>
    !studentSkills.some(s => s.toLowerCase() === is.toLowerCase())
  );
  return { score: matched.length * 5, matched, missing };
}

function getDomainScore(interest: string, domain: string): number {
  return interest.toLowerCase() === domain.toLowerCase() ? 3 : 0;
}

function getLocationScore(preference: string, mode: string): number {
  if (preference === "Any") return 2;
  if (preference === "Remote" && mode === "Remote") return 2;
  if (preference === "City" && (mode === "Onsite" || mode === "Hybrid")) return 2;
  return 0;
}

function getExperienceScore(experience: string, difficulty: string): number {
  if (experience === "Beginner" && difficulty === "Beginner") return 2;
  if (experience === "Intermediate" && (difficulty === "Beginner" || difficulty === "Intermediate")) return 2;
  if (experience === "Intermediate" && difficulty === "Advanced") return 1;
  return 0;
}

function detectScam(internship: Internship): { isScam: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Check unrealistic stipend
  const stipendNum = parseInt(internship.stipend.replace(/[^0-9]/g, ""));
  if (stipendNum > 30000 && internship.difficulty === "Beginner") {
    reasons.push("Unusually high stipend for beginner level");
  }
  
  // Check missing company website
  if (!internship.companyWebsite) {
    reasons.push("No company website provided");
  }
  
  // Check verified status
  if (!internship.verified) {
    reasons.push("Company not verified");
  }
  
  // Check too-good-to-be-true descriptions
  const susWords = ["guaranteed", "minimal work", "easy money", "no experience needed"];
  const descLower = internship.description.toLowerCase();
  if (susWords.some(w => descLower.includes(w))) {
    reasons.push("Description contains suspicious claims");
  }
  
  // Very short duration with high pay
  if (internship.duration === "1 month" && stipendNum > 25000) {
    reasons.push("Very short duration with unusually high pay");
  }

  return { isScam: reasons.length >= 2, reasons };
}

function getSuccessProbability(matchPercentage: number, experienceMatch: boolean, difficultyMatch: boolean): "High" | "Medium" | "Low" {
  let score = matchPercentage;
  if (experienceMatch) score += 10;
  if (difficultyMatch) score += 10;
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function getRecommendations(profile: StudentProfile, count = 5): RecommendedInternship[] {
  const scored = internships.map((internship) => {
    const { score: skillScore, matched: matchedSkills, missing: missingSkills } = getSkillScore(profile.skills, internship.requiredSkills);
    const domainScore = getDomainScore(profile.interest, internship.domain);
    const locationScore = getLocationScore(profile.location, internship.mode);
    const expScore = getExperienceScore(profile.experience, internship.difficulty);

    const score = skillScore + domainScore + locationScore + expScore;
    const maxPossible = internship.requiredSkills.length * 5 + 3 + 2 + 2;
    const matchPercentage = Math.round((score / maxPossible) * 100);

    const reasons: string[] = [];
    if (matchedSkills.length > 0) reasons.push(`Your skills match: ${matchedSkills.join(", ")}`);
    if (domainScore > 0) reasons.push(`Matches your interest: ${profile.interest}`);
    if (locationScore > 0) {
      if (internship.mode === "Remote") reasons.push("Remote option available");
      else reasons.push(`${internship.mode} in ${internship.location}`);
    }
    if (expScore > 0) reasons.push(`Suitable for ${profile.experience} level`);

    const scam = detectScam(internship);
    const experienceMatch = (profile.experience === "Beginner" && internship.difficulty === "Beginner") ||
      (profile.experience === "Intermediate" && internship.difficulty !== "Advanced");
    const difficultyMatch = profile.experience === "Beginner" ? internship.difficulty === "Beginner" : true;

    return {
      ...internship,
      score,
      maxScore: maxPossible,
      matchPercentage: Math.min(matchPercentage, 100),
      matchedSkills,
      missingSkills,
      reasons,
      successProbability: getSuccessProbability(matchPercentage, experienceMatch, difficultyMatch),
      scamWarning: scam.isScam,
      scamReasons: scam.reasons,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .filter(i => i.score > 0);
}

export function getSkillGaps(profile: StudentProfile, recommendations: RecommendedInternship[]): SkillGap[] {
  const allMissing = new Set<string>();
  recommendations.forEach(r => r.missingSkills.forEach(s => allMissing.add(s)));
  
  return Array.from(allMissing).map(skill => ({
    skill,
    resource: SKILL_RESOURCES[skill]?.name || `Learn ${skill} online`,
    resourceUrl: SKILL_RESOURCES[skill]?.url || `https://www.google.com/search?q=learn+${encodeURIComponent(skill)}`,
  }));
}

export function getCareerPaths(profile: StudentProfile): CareerPath[] {
  return CAREER_PATHS
    .map(path => {
      const matching = profile.skills.filter(s => path.skills.includes(s));
      const missing = path.skills.filter(s => !profile.skills.includes(s));
      const domainMatch = path.domains.includes(profile.interest) ? 1 : 0;
      const score = matching.length + domainMatch;
      
      const relevant = internships
        .filter(i => path.domains.includes(i.domain))
        .slice(0, 3)
        .map(i => i.id);

      return {
        title: path.title,
        description: path.description,
        requiredSkills: path.skills,
        matchingSkills: matching,
        missingSkills: missing,
        relevantInternships: relevant,
        score,
      };
    })
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, 5)
    .map(({ score, ...rest }) => rest as any as CareerPath);
}

export function getReadinessScore(profile: StudentProfile): {
  total: number;
  breakdown: { label: string; score: number; max: number }[];
  suggestions: string[];
} {
  const skillScore = Math.min(profile.skills.length * 8, 40);
  const projectScore = Math.min((profile.projects || 0) * 10, 20);
  const certScore = Math.min((profile.certifications || 0) * 6, 12);
  
  const eduRelevance = ["B.Tech / B.E.", "M.Tech / M.E.", "B.Sc", "M.Sc", "MBA"].includes(profile.education) ? 15 : 8;
  const expScore = profile.experience === "Intermediate" ? 13 : 5;
  
  const total = skillScore + projectScore + certScore + eduRelevance + expScore;
  
  const suggestions: string[] = [];
  if (skillScore < 30) suggestions.push("Add more skills to your profile to improve your score");
  if (projectScore < 10) suggestions.push("Work on projects to showcase your abilities");
  if (certScore < 6) suggestions.push("Get certifications in your area of interest");
  if (profile.experience === "Beginner") suggestions.push("Gain experience through personal projects or freelancing");
  
  return {
    total: Math.min(total, 100),
    breakdown: [
      { label: "Skills", score: skillScore, max: 40 },
      { label: "Projects", score: projectScore, max: 20 },
      { label: "Certifications", score: certScore, max: 12 },
      { label: "Education", score: eduRelevance, max: 15 },
      { label: "Experience", score: expScore, max: 13 },
    ],
    suggestions,
  };
}

export function filterInternships(
  list: Internship[],
  filters: { domain?: string; mode?: string; skill?: string; location?: string; difficulty?: string }
): Internship[] {
  return list.filter((i) => {
    if (filters.domain && i.domain !== filters.domain) return false;
    if (filters.mode && i.mode !== filters.mode) return false;
    if (filters.skill && !i.requiredSkills.includes(filters.skill)) return false;
    if (filters.location && i.location !== filters.location) return false;
    if (filters.difficulty && i.difficulty !== filters.difficulty) return false;
    return true;
  });
}
