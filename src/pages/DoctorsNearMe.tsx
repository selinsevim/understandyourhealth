import { useState } from "react";
import { MapPin, Navigation, ExternalLink, Stethoscope, Phone, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const specialties = [
  { label: "General Practitioner", query: "general+practitioner" },
  { label: "Cardiologist", query: "cardiologist" },
  { label: "Endocrinologist", query: "endocrinologist" },
  { label: "Hematologist", query: "hematologist" },
  { label: "Dermatologist", query: "dermatologist" },
  { label: "Neurologist", query: "neurologist" },
  { label: "Pediatrician", query: "pediatrician" },
  { label: "Urgent Care", query: "urgent+care" },
];

const DoctorsNearMe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [customSearch, setCustomSearch] = useState("");

  const openGoogleMaps = (query: string) => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      // Fallback without location
      window.open(`https://www.google.com/maps/search/${query}+near+me`, "_blank");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(
          `https://www.google.com/maps/search/${query}/@${latitude},${longitude},13z`,
          "_blank"
        );
        setLoading(false);
      },
      () => {
        // Fallback if denied
        window.open(`https://www.google.com/maps/search/${query}+near+me`, "_blank");
        setLoading(false);
      },
      { timeout: 5000 }
    );
  };

  const handleSpecialtyClick = (query: string, label: string) => {
    setSelectedSpecialty(label);
    openGoogleMaps(query + "+doctor");
  };

  const handleCustomSearch = () => {
    if (!customSearch.trim()) return;
    openGoogleMaps(customSearch.trim().replace(/\s+/g, "+") + "+doctor");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Find Doctors Near You
          </h1>
          <p className="mt-3 text-muted-foreground">
            Select a specialty or search for a specific type of doctor. We'll help you find nearby providers using Google Maps.
          </p>
        </motion.div>

        {/* Custom search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomSearch()}
                placeholder="Search for a specialty, e.g. 'orthopedic surgeon'"
                className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={handleCustomSearch}
              disabled={!customSearch.trim()}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Specialty grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Browse by Specialty</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {specialties.map((s, i) => (
              <button
                key={s.label}
                onClick={() => handleSpecialtyClick(s.query, s.label)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">Find nearby</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl border border-border bg-muted/30 p-6"
        >
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">Tips for Your Visit</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Call ahead to confirm they accept your insurance and are taking new patients.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Bring your translated MedMind report — it can help your doctor understand your concerns.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Use the "Questions to Ask Your Doctor" from your report during your appointment.</span>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsNearMe;
