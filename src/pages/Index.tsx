import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, Stethoscope, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
{
  icon: Sparkles,
  title: "Instant Translation",
  description: "Paste your lab results and get a clear, friendly explanation in seconds."
},
{
  icon: Palette,
  title: "Color-Coded Results",
  description: "Green, yellow, and red indicators show you exactly what needs attention."
},
{
  icon: Stethoscope,
  title: "Ask Your Doctor",
  description: "Auto-generated questions to bring to your next appointment."
}];


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

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {features.map((f, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
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