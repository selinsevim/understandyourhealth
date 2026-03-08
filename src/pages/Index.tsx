import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, Stethoscope, Shield, AlertTriangle, Clock, Brain, HeartPulse, MessageSquareText, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const problems = [
  {
    icon: AlertTriangle,
    title: "Jargon-Heavy Reports",
    description: "Lab results are written for doctors, not patients. Abbreviations, units, and reference ranges make no sense to most people."
  },
  {
    icon: Brain,
    title: "Anxiety From the Unknown",
    description: "Seeing unfamiliar numbers without context causes unnecessary stress and late-night Google spirals."
  },
  {
    icon: Clock,
    title: "Doctor Time Is Scarce",
    description: "The average appointment is 15 minutes. There's rarely enough time to explain every single result in detail."
  }
];

const features = [
  {
    icon: Sparkles,
    title: "Instant Translation",
    description: "Paste your lab results and get a clear, friendly explanation in seconds — no medical degree needed."
  },
  {
    icon: Palette,
    title: "Color-Coded Results",
    description: "Green, yellow, and red indicators show you exactly what's normal, borderline, or needs attention."
  },
  {
    icon: Stethoscope,
    title: "Smart Questions for Your Doctor",
    description: "Auto-generated questions to bring to your next appointment so you make the most of your time."
  },
  {
    icon: HeartPulse,
    title: "Track Your Health Over Time",
    description: "Save reports and compare results across visits to spot trends and improvements."
  },
  {
    icon: Users,
    title: "Family Profiles",
    description: "Manage reports for your parents, kids, or partner — all in one place."
  },
  {
    icon: MessageSquareText,
    title: "Multi-Language Support",
    description: "Get your results explained in the language you're most comfortable with."
  }
];


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pb-20 pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Your data stays private and secure
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Understand your health results —{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>finally.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Paste your lab report or doctor notes. We'll explain everything in plain human language — like a caring friend who happens to be a doctor.

            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/translate"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 bg-primary"
                style={{ backgroundImage: "var(--gradient-button)" }}>
                
                Translate My Report
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/translate?demo=true"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted">
                
                Try Free Demo
              </Link>
            </div>
          </motion.div>

          {/* Animated transform illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-16 max-w-2xl">
            
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-lg" style={{ background: "var(--gradient-soft)", borderColor: "hsl(var(--purple-glow) / 0.2)" }}>
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-lg bg-muted p-4">
                  <p className="font-mono text-xs text-muted-foreground">
                    WBC 7.2 K/uL (ref 4.5-11.0)<br />
                    RBC 4.8 M/uL (ref 4.2-5.4)<br />
                    HgB 14.2 g/dL (ref 13.5-17.5)
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  
                  <ArrowRight className="h-6 w-6 text-primary" />
                </motion.div>
                <div className="flex-1 rounded-lg bg-primary/5 p-4">
                  <p className="text-sm text-foreground">
                    ✅ White blood cells — <span className="font-medium text-success">Normal</span><br />
                    ✅ Red blood cells — <span className="font-medium text-success">Normal</span><br />
                    ✅ Hemoglobin — <span className="font-medium text-success">Normal</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem + Statistics */}
      <section className="border-t border-border py-20" style={{ background: "linear-gradient(180deg, hsl(270 60% 96%), hsl(var(--background)))" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              The problem is clear
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Millions of people receive lab results they can't understand — and the system isn't built to help.
            </p>
          </motion.div>

          {/* Stats row */}
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-14">
            {[
              { stat: "80%", label: "of patients struggle to understand their lab results", source: "JMIR", url: "https://www.jmir.org/2020/12/e18725/" },
              { stat: "15 min", label: "average doctor visit — not enough to explain every result", source: "CDC", url: "https://www.cdc.gov/nchs/fastats/physician-visits.htm" },
              { stat: "77%", label: "of patients use the internet to search health info", source: "Pew Research", url: "https://www.pewresearch.org/internet/fact-sheet/internet-broadband/" },
              { stat: "47%", label: "report anxiety after receiving unexplained lab results", source: "BMJ", url: "https://www.bmj.com/content/350/bmj.g7624" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center">
                <p className="font-display text-4xl font-bold text-foreground">{item.stat}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.label}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-primary/60 underline underline-offset-2 hover:text-primary transition-colors">— {item.source}</a>
              </motion.div>
            ))}
          </div>

          {/* Problem cards */}
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {problems.map((p, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border p-6" style={{ borderColor: "hsl(270 60% 70% / 0.25)", background: "linear-gradient(135deg, hsl(270 60% 97%), hsl(280 50% 95%))" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "hsl(270 60% 90%)" }}>
                  <p.icon className="h-6 w-6" style={{ color: "hsl(270 70% 50%)" }} />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features / Solution */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How MedMind helps
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              We translate your reports into plain language — so you can understand your health and take action.
            </p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundImage: "var(--gradient-soft)" }}>
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Social proof */}
      





      

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MedMind. Your report is processed securely and never stored without your permission.</p>
        </div>
      </footer>
    </div>);

};

export default Index;