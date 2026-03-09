import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRocket, FaBolt, FaBrain, FaScrewdriverWrench, FaTimeline, FaShieldHalved, FaArrowTrendUp,
  FaArrowRight, FaUpload, FaChartLine, FaTriangleExclamation, FaFileLines,
  FaUser, FaGear, FaStar, FaEnvelope, FaLink, FaGlobe
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type IconType } from "react-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const featureIcons: IconType[] = [FaBolt, FaBrain, FaScrewdriverWrench, FaTimeline, FaShieldHalved, FaArrowTrendUp];
const pipelineIcons: IconType[] = [FaUser, FaScrewdriverWrench, FaGear, FaStar, FaChartLine];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const features = [
    { icon: featureIcons[0], title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
    { icon: featureIcons[1], title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
    { icon: featureIcons[2], title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
    { icon: featureIcons[3], title: t("landing.feat4Title"), desc: t("landing.feat4Desc") },
    { icon: featureIcons[4], title: t("landing.feat5Title"), desc: t("landing.feat5Desc") },
    { icon: featureIcons[5], title: t("landing.feat6Title"), desc: t("landing.feat6Desc") },
  ];

  const pipelineSteps = [
    { icon: pipelineIcons[0], label: t("landing.step1") },
    { icon: pipelineIcons[1], label: t("landing.step2") },
    { icon: pipelineIcons[2], label: t("landing.step3") },
    { icon: pipelineIcons[3], label: t("landing.step4") },
    { icon: pipelineIcons[4], label: t("landing.step5") },
  ];

  const floatingCards = [
    { icon: FaChartLine, title: t("landing.aiScore"), sub: t("landing.matchScore"), color: "text-primary", delay: 0 },
    { icon: FaTriangleExclamation, title: t("landing.analysis"), sub: t("landing.skillGapAnalysis"), color: "text-warning", delay: 0.15 },
    { icon: FaFileLines, title: t("landing.performance"), sub: t("landing.resumeScore"), color: "text-success", delay: 0.3 },
  ];

  const navItems = [
    { label: t("landing.navFeatures"), id: "features" },
    { label: t("landing.navHow"), id: "how-it-works" },
    { label: t("landing.navDashboard"), id: "dashboard" },
    { label: t("landing.navPricing"), id: "pricing" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <FaRocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">InternAI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "dashboard") navigate("/dashboard");
                  else document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            {user ? (
              <Button onClick={async () => { await logout(); }} variant="outline" size="sm" className="rounded-lg text-xs">
                {t("landing.signOut")}
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/sign-in")} variant="ghost" size="sm" className="text-xs">
                  {t("landing.signIn")}
                </Button>
                <Button onClick={() => navigate("/profile")} size="sm" className="gradient-primary text-primary-foreground rounded-lg text-xs shadow-glow">
                  {t("landing.getStarted")}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] gradient-glow pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <FaRocket className="w-3 h-3" /> {t("landing.badgeNew")}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5">
              {t("landing.title1")}{" "}
              <br className="hidden sm:block" />
              {t("landing.title2")}{" "}
              <span className="text-gradient">{t("landing.title3")}</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t("landing.subtitle")}
            </p>

            {/* CTA buttons - relative so floating cards can overlap */}
            <div className="relative z-0 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                onClick={() => navigate("/profile")}
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-sm font-semibold px-7 py-5 rounded-xl"
              >
                {t("landing.cta")} <FaArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="border-border bg-card/80 hover:bg-card text-foreground text-sm font-semibold px-7 py-5 rounded-xl"
              >
                <FaUpload className="w-3.5 h-3.5 mr-2" /> {t("landing.resume")}
              </Button>
            </div>
          </motion.div>

          {/* Right - Floating cards */}
          <motion.div
            className="flex-1 relative w-full max-w-md h-[340px] lg:-ml-16 lg:mt-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {floatingCards.map((card, i) => {
              const positions = [
                "top-0 -left-6 lg:-left-20",
                "top-6 right-0 lg:-right-2",
                "bottom-0 left-[12%] lg:left-[5%]",
              ];
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + card.delay, duration: 0.6, type: "spring" }}
                  className={`absolute ${positions[i]} glass-panel rounded-2xl p-5 shadow-float animate-float w-[210px] z-10`}
                  style={{ animationDelay: `${i * 0.7}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{card.title}</p>
                      <p className="text-[11px] text-muted-foreground">{card.sub}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("landing.featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("landing.pipelineTitle")}
            </h2>
            <p className="text-muted-foreground">{t("landing.pipelineSubtitle")}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-2">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-2 md:gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <FaArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("landing.dashPreviewTitle")}
            </h2>
            <p className="text-muted-foreground">{t("landing.dashPreviewSubtitle")}</p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-float"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 bg-background rounded-md px-3 py-1 text-[10px] text-muted-foreground">
                app.internai.io/dashboard/recommendations
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      <FaRocket className="w-3 h-3" /> Pro Plan
                    </span>
                  </p>
                  <h3 className="font-display font-bold text-foreground">{t("landing.topRec")}</h3>
                  <p className="text-xs text-muted-foreground">{t("landing.basedOn")}</p>
                </div>
                <Button size="sm" className="gradient-primary text-primary-foreground rounded-lg text-xs">
                  <FaBolt className="w-3 h-3 mr-1" /> {t("landing.refreshMatches")}
                </Button>
              </div>

              {[
                { role: "Product Designer", company: "Stripe • Remote", match: "98%" },
                { role: "Software Intern", company: "Linear • San Francisco", match: "94%" },
              ].map((job) => (
                <div key={job.role} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                      <FaStar className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{job.role}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{job.match} Match</span>
                </div>
              ))}

              <div>
                <p className="text-xs font-semibold text-foreground mb-3">{t("landing.skillGap")}</p>
                {[
                  { skill: "React Native", pct: 80 },
                  { skill: "System Design", pct: 45 },
                ].map((s) => (
                  <div key={s.skill} className="mb-2.5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">{s.skill}</span>
                      <span className="text-foreground font-medium">{s.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <FaRocket className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-foreground">InternAI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("landing.footerDesc")}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{t("landing.platform")}</h4>
              <div className="space-y-2">
                {[t("landing.navHow"), "Match Engine", t("landing.navDashboard")].map((l) => (
                  <button key={l} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{t("landing.resources")}</h4>
              <div className="space-y-2">
                {["Career Blog", "Resume Tips", "Interview Guide", "Help Center"].map((l) => (
                  <button key={l} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{t("landing.stayConnected")}</h4>
              <div className="flex items-center gap-3 mb-4">
                <FaGlobe className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <FaEnvelope className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <FaLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder={t("landing.subscribe")}
                  className="flex-1 text-xs bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <FaArrowRight className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">{t("landing.copyright")}</p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
