import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Upload as UploadIcon, Sparkles, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLoader from "@/components/AnimatedLoader";
import UploadDropzone from "@/components/UploadDropzone";
import { supabase } from "@/integrations/supabase/client";

const SAMPLE_REPORT = `CBC Results: WBC 7.2 K/uL (ref 4.5-11.0), RBC 4.8 M/uL (ref 4.2-5.4), Hemoglobin 14.2 g/dL (ref 13.5-17.5), Hematocrit 42% (ref 41-53), Platelets 320 K/uL (ref 150-400). Lipid Panel: Total Cholesterol 215 mg/dL (ref <200), LDL 142 mg/dL (ref <100), HDL 45 mg/dL (ref >40), Triglycerides 140 mg/dL (ref <150). TSH 2.1 mIU/L (ref 0.4-4.0).`;

const Translate = () => {
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [reportText, setReportText] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("sample") === "true") {
      setReportText(SAMPLE_REPORT);
    }
  }, [searchParams]);

  const handleTranslate = async () => {
    if (!reportText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("translate-report", {
        body: { reportText: reportText.trim(), age, conditions },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Store result and report text in sessionStorage for results page
      sessionStorage.setItem("medmind_result", JSON.stringify(data));
      sessionStorage.setItem("medmind_report_text", reportText.trim());
      navigate("/results");
    } catch (err: any) {
      console.error("Translation error:", err);
      setError("We had trouble reading this report. Try pasting just a section at a time.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AnimatedLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Translate Your Report
          </h1>
          <p className="mt-3 text-muted-foreground">
            Paste your lab results or doctor notes below. We'll explain everything in plain English.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setTab("paste")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "paste" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Paste Text
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "upload" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <UploadIcon className="h-4 w-4" />
            Upload PDF
          </button>
        </div>

        {/* Input area */}
        <div className="mt-6">
          {tab === "paste" ? (
            <div>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste your lab results or doctor notes here..."
                className="min-h-[200px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={() => setReportText(SAMPLE_REPORT)}
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                Try a sample report
              </button>
            </div>
          ) : (
            <UploadDropzone onFileSelect={() => {}} />
          )}
        </div>

        {/* Optional context */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Your age (optional)</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 35"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Known conditions (optional)</label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g., diabetes, high blood pressure"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleTranslate}
          disabled={!reportText.trim()}
          className="mt-8 w-full rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Translate My Report
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          🔒 Your report is processed securely and never stored without your permission.
        </p>
      </div>
    </div>
  );
};

export default Translate;
