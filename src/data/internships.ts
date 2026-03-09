export interface Internship {
  id: string;
  title: string;
  company: string;
  requiredSkills: string[];
  domain: string;
  location: string;
  mode: "Remote" | "Hybrid" | "Onsite";
  eligibility: string;
  stipend: string;
  description: string;
  applicationLink: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  verified: boolean;
  companyWebsite?: string;
}

export interface StudentProfile {
  education: string;
  fieldOfStudy: string;
  skills: string[];
  interest: string;
  location: "Remote" | "City" | "Any";
  experience: "Beginner" | "Intermediate";
  projects?: number;
  certifications?: number;
}

export interface SkillGap {
  skill: string;
  resource: string;
  resourceUrl: string;
}

export interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  relevantInternships: string[];
}

export interface RecommendedInternship extends Internship {
  score: number;
  maxScore: number;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  successProbability: "High" | "Medium" | "Low";
  scamWarning: boolean;
  scamReasons: string[];
}

export const ALL_SKILLS = [
  "Python", "JavaScript", "SQL", "Java", "C++", "React", "HTML/CSS",
  "Excel", "Data Analysis", "Machine Learning", "Communication",
  "Marketing", "Design", "Writing", "Research", "Node.js",
  "TypeScript", "Git", "Figma", "SEO", "Social Media",
  "Photoshop", "Public Speaking", "Leadership", "Teamwork",
  "Tableau", "Power BI", "Data Visualization", "R",
  "Docker", "AWS", "MongoDB", "PostgreSQL",
];

export const DOMAINS = [
  "Software Development",
  "Data Science",
  "Web Development",
  "AI / Machine Learning",
  "Marketing",
  "Design",
  "Business",
  "Content Writing",
];

export const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "B.Tech / B.E.",
  "B.Sc",
  "B.Com",
  "BBA",
  "B.A.",
  "M.Tech / M.E.",
  "M.Sc",
  "MBA",
  "Other",
];

export const SKILL_RESOURCES: Record<string, { name: string; url: string }> = {
  "Python": { name: "Python for Beginners - freeCodeCamp", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
  "JavaScript": { name: "JavaScript - freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  "SQL": { name: "SQL Tutorial - W3Schools", url: "https://www.w3schools.com/sql/" },
  "React": { name: "React Tutorial - React.dev", url: "https://react.dev/learn" },
  "HTML/CSS": { name: "HTML/CSS - freeCodeCamp", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
  "Machine Learning": { name: "ML Course - Coursera", url: "https://www.coursera.org/learn/machine-learning" },
  "Data Analysis": { name: "Data Analysis - Kaggle", url: "https://www.kaggle.com/learn" },
  "Excel": { name: "Excel Skills - Coursera", url: "https://www.coursera.org/learn/excel-basics-data-analysis-ibm" },
  "Git": { name: "Git Tutorial - Atlassian", url: "https://www.atlassian.com/git/tutorials" },
  "Figma": { name: "Figma Tutorial - YouTube", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8" },
  "SEO": { name: "SEO Basics - Google", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
  "Node.js": { name: "Node.js - freeCodeCamp", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" },
  "TypeScript": { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" },
  "Tableau": { name: "Tableau Free Training", url: "https://www.tableau.com/learn/training/20204" },
  "Power BI": { name: "Power BI Learning Path", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
  "Data Visualization": { name: "Data Viz - Kaggle", url: "https://www.kaggle.com/learn/data-visualization" },
  "Marketing": { name: "Digital Marketing - Google", url: "https://learndigital.withgoogle.com/digitalgarage" },
  "Design": { name: "Design Fundamentals - Coursera", url: "https://www.coursera.org/learn/fundamentals-of-graphic-design" },
  "Writing": { name: "Writing Skills - Coursera", url: "https://www.coursera.org/learn/writing-professional" },
  "Communication": { name: "Communication Skills", url: "https://www.coursera.org/learn/wharton-communication" },
  "Research": { name: "Research Methods - Coursera", url: "https://www.coursera.org/learn/research-methods" },
  "Docker": { name: "Docker Tutorial", url: "https://docs.docker.com/get-started/" },
  "AWS": { name: "AWS Cloud Practitioner", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/" },
  "Social Media": { name: "Social Media Marketing", url: "https://www.coursera.org/learn/social-media-marketing" },
};

export const CAREER_PATHS: { title: string; description: string; skills: string[]; domains: string[] }[] = [
  { title: "Data Analyst", description: "Analyze data to help businesses make decisions", skills: ["Python", "SQL", "Excel", "Data Analysis", "Tableau", "Data Visualization"], domains: ["Data Science", "Business"] },
  { title: "Machine Learning Engineer", description: "Build and deploy ML models at scale", skills: ["Python", "Machine Learning", "SQL", "Data Analysis", "Docker", "AWS"], domains: ["AI / Machine Learning", "Data Science"] },
  { title: "Data Scientist", description: "Extract insights from complex datasets using statistical methods", skills: ["Python", "SQL", "Machine Learning", "Data Analysis", "R", "Data Visualization"], domains: ["Data Science", "AI / Machine Learning"] },
  { title: "Frontend Developer", description: "Build beautiful, interactive web interfaces", skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Figma", "Git"], domains: ["Web Development", "Design"] },
  { title: "Backend Developer", description: "Build server-side applications and APIs", skills: ["Python", "Node.js", "SQL", "Git", "Docker", "AWS"], domains: ["Software Development", "Web Development"] },
  { title: "Full Stack Developer", description: "Work on both frontend and backend", skills: ["JavaScript", "React", "Node.js", "SQL", "Git", "TypeScript"], domains: ["Web Development", "Software Development"] },
  { title: "UI/UX Designer", description: "Design intuitive and beautiful user experiences", skills: ["Design", "Figma", "Research", "HTML/CSS", "Communication"], domains: ["Design"] },
  { title: "Digital Marketer", description: "Drive growth through digital channels", skills: ["Marketing", "SEO", "Social Media", "Writing", "Data Analysis", "Communication"], domains: ["Marketing", "Content Writing"] },
  { title: "Business Analyst", description: "Bridge the gap between business needs and technology", skills: ["Excel", "Data Analysis", "Communication", "SQL", "Power BI", "Research"], domains: ["Business", "Data Science"] },
  { title: "AI Research Scientist", description: "Push the boundaries of artificial intelligence", skills: ["Python", "Machine Learning", "Research", "Data Analysis", "R"], domains: ["AI / Machine Learning"] },
  { title: "Content Strategist", description: "Plan and create engaging content", skills: ["Writing", "SEO", "Communication", "Research", "Social Media", "Marketing"], domains: ["Content Writing", "Marketing"] },
  { title: "DevOps Engineer", description: "Automate and streamline development processes", skills: ["Git", "Docker", "AWS", "Python", "Node.js", "SQL"], domains: ["Software Development"] },
];

export const internships: Internship[] = [
  {
    id: "1", title: "Software Developer Intern", company: "TechNova Solutions",
    requiredSkills: ["Python", "JavaScript", "Git"], domain: "Software Development",
    location: "Bangalore", mode: "Hybrid",
    eligibility: "B.Tech / B.E. students, 2nd year+", stipend: "₹15,000/month",
    description: "Work on building scalable web applications and APIs. Collaborate with senior developers on real-world projects. Great learning environment for beginners.",
    applicationLink: "#", duration: "3 months", difficulty: "Beginner", verified: true, companyWebsite: "https://technova.example.com",
  },
  {
    id: "2", title: "Data Analyst Intern", company: "DataMinds Analytics",
    requiredSkills: ["Python", "SQL", "Excel", "Data Analysis"], domain: "Data Science",
    location: "Remote", mode: "Remote",
    eligibility: "Any undergraduate student", stipend: "₹12,000/month",
    description: "Analyze business data to extract insights. Create dashboards and reports. Learn industry-standard data tools and techniques.",
    applicationLink: "#", duration: "2 months", difficulty: "Beginner", verified: true, companyWebsite: "https://dataminds.example.com",
  },
  {
    id: "3", title: "Frontend Web Developer Intern", company: "PixelCraft Studios",
    requiredSkills: ["HTML/CSS", "JavaScript", "React"], domain: "Web Development",
    location: "Mumbai", mode: "Remote",
    eligibility: "Any student with basic web knowledge", stipend: "₹10,000/month",
    description: "Build beautiful, responsive web interfaces. Work with modern frameworks like React. Perfect for students passionate about UI/UX.",
    applicationLink: "#", duration: "3 months", difficulty: "Beginner", verified: true, companyWebsite: "https://pixelcraft.example.com",
  },
  {
    id: "4", title: "AI Research Intern", company: "DeepThink Labs",
    requiredSkills: ["Python", "Machine Learning", "Research"], domain: "AI / Machine Learning",
    location: "Hyderabad", mode: "Hybrid",
    eligibility: "B.Tech/M.Tech in CS or related field", stipend: "₹20,000/month",
    description: "Contribute to cutting-edge AI research projects. Work with neural networks and NLP models. Publish research papers with the team.",
    applicationLink: "#", duration: "6 months", difficulty: "Advanced", verified: true, companyWebsite: "https://deepthink.example.com",
  },
  {
    id: "5", title: "Digital Marketing Intern", company: "BrandBoost Media",
    requiredSkills: ["Marketing", "SEO", "Social Media", "Writing"], domain: "Marketing",
    location: "Delhi", mode: "Remote",
    eligibility: "Any undergraduate student", stipend: "₹8,000/month",
    description: "Learn digital marketing strategies including SEO, social media marketing, and content creation. Hands-on campaign management experience.",
    applicationLink: "#", duration: "2 months", difficulty: "Beginner", verified: true, companyWebsite: "https://brandboost.example.com",
  },
  {
    id: "6", title: "UI/UX Design Intern", company: "DesignFlow Studio",
    requiredSkills: ["Design", "Figma", "Research"], domain: "Design",
    location: "Remote", mode: "Remote",
    eligibility: "Any student interested in design", stipend: "₹10,000/month",
    description: "Design user interfaces for mobile and web apps. Conduct user research and create wireframes. Build your design portfolio.",
    applicationLink: "#", duration: "3 months", difficulty: "Beginner", verified: true, companyWebsite: "https://designflow.example.com",
  },
  {
    id: "7", title: "Backend Developer Intern", company: "CloudStack Systems",
    requiredSkills: ["Node.js", "Python", "SQL", "Git"], domain: "Software Development",
    location: "Pune", mode: "Onsite",
    eligibility: "B.Tech 3rd year+ in CS/IT", stipend: "₹18,000/month",
    description: "Build robust backend systems and REST APIs. Work with databases and cloud services. Learn production-grade software practices.",
    applicationLink: "#", duration: "4 months", difficulty: "Intermediate", verified: true, companyWebsite: "https://cloudstack.example.com",
  },
  {
    id: "8", title: "Content Writing Intern", company: "WordSmith Media",
    requiredSkills: ["Writing", "Communication", "Research", "SEO"], domain: "Content Writing",
    location: "Remote", mode: "Remote",
    eligibility: "Any student with good English skills", stipend: "₹6,000/month",
    description: "Write blogs, articles, and social media content. Learn SEO-optimized writing. Build a professional writing portfolio.",
    applicationLink: "#", duration: "2 months", difficulty: "Beginner", verified: true, companyWebsite: "https://wordsmith.example.com",
  },
  {
    id: "9", title: "Business Analyst Intern", company: "StrategyHub Consulting",
    requiredSkills: ["Excel", "Data Analysis", "Communication", "Research"], domain: "Business",
    location: "Bangalore", mode: "Hybrid",
    eligibility: "BBA/MBA students preferred", stipend: "₹14,000/month",
    description: "Analyze business processes and market data. Create strategy reports and presentations. Work directly with senior consultants.",
    applicationLink: "#", duration: "3 months", difficulty: "Intermediate", verified: true, companyWebsite: "https://strategyhub.example.com",
  },
  {
    id: "10", title: "Machine Learning Intern", company: "NeuralWave AI",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "SQL"], domain: "AI / Machine Learning",
    location: "Remote", mode: "Remote",
    eligibility: "B.Tech/M.Tech students with ML basics", stipend: "₹22,000/month",
    description: "Build and deploy ML models for real-world applications. Work with large datasets. Learn MLOps and model deployment.",
    applicationLink: "#", duration: "4 months", difficulty: "Intermediate", verified: true, companyWebsite: "https://neuralwave.example.com",
  },
  {
    id: "11", title: "Full Stack Developer Intern", company: "WebForge Technologies",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL"], domain: "Web Development",
    location: "Chennai", mode: "Hybrid",
    eligibility: "B.Tech students with web dev experience", stipend: "₹16,000/month",
    description: "Work on both frontend and backend of web applications. Use modern technologies like React and Node.js. Ship features end-to-end.",
    applicationLink: "#", duration: "3 months", difficulty: "Intermediate", verified: true, companyWebsite: "https://webforge.example.com",
  },
  {
    id: "12", title: "Social Media Marketing Intern", company: "ViralVibe Agency",
    requiredSkills: ["Social Media", "Marketing", "Design", "Communication"], domain: "Marketing",
    location: "Remote", mode: "Remote",
    eligibility: "Any student with social media skills", stipend: "₹7,000/month",
    description: "Manage social media accounts for clients. Create engaging content and campaigns. Learn analytics and growth strategies.",
    applicationLink: "#", duration: "2 months", difficulty: "Beginner", verified: true, companyWebsite: "https://viralvibe.example.com",
  },
  {
    id: "13", title: "Crypto Trading Assistant", company: "QuickBucks Inc",
    requiredSkills: ["Excel", "Data Analysis"], domain: "Business",
    location: "Remote", mode: "Remote",
    eligibility: "Anyone", stipend: "₹50,000/month",
    description: "Assist in crypto trading operations. Very high stipend for minimal work.",
    applicationLink: "#", duration: "1 month", difficulty: "Beginner", verified: false,
  },
  {
    id: "14", title: "Data Entry Executive", company: "EasyWork Solutions",
    requiredSkills: ["Excel"], domain: "Business",
    location: "Remote", mode: "Remote",
    eligibility: "Anyone", stipend: "₹35,000/month",
    description: "Simple data entry work from home. Guaranteed earnings.",
    applicationLink: "#", duration: "1 month", difficulty: "Beginner", verified: false,
  },
];
