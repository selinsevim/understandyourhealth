import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, BookmarkPlus, ListChecks, MessageCircleQuestion, Check } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import OverallSummaryBanner from "@/components/OverallSummaryBanner";
import ReportCard from "@/components/ReportCard";
import QuestionCard from "@/components/QuestionCard";
import ResultsDonutChart from "@/components/ResultsDonutChart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranslationResult {
  overallStatus: "all_clear" | "watch" | "concern";
  overallSummary: string;
  sections: {
    sectionName: string;
    items: {
      testName: string;
      originalName: string;
      value: string;
      normalRange: string;
      status: "normal" | "watch" | "concern";
      simpleExplanation: string;
      detailedExplanation: string;
    }[];
  }[];
  keyTakeaways: string[];
  questionsForDoctor: string[];
  actionItems: string[];
}

const Results = () => {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const stored = sessionStorage.getItem("medmind_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        navigate("/translate");
      }
    } else {
      navigate("/translate");
    }
  }, [navigate]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save reports");
      navigate("/auth");
      return;
    }
    if (!result) return;

    setSaving(true);
    try {
      const reportText = sessionStorage.getItem("medmind_report_text") || "Imported report";
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        report_text: reportText,
        result: result as any,
        overall_status: result.overallStatus,
        title: result.sections[0]?.sectionName || "Lab Report",
      });
      if (error) throw error;
      setSaved(true);
      toast.success("Report saved to your history!");
    } catch (err: any) {
      toast.error("Failed to save report");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const statusPriority = { concern: 0, watch: 1, normal: 2 };

  const sortedSections = result
    ? result.sections
        .map((section) => ({
          ...section,
          items: [...section.items].sort(
            (a, b) => statusPriority[a.status] - statusPriority[b.status]
          ),
        }))
        .sort((a, b) => {
          const aMin = Math.min(...a.items.map((i) => statusPriority[i.status]));
          const bMin = Math.min(...b.items.map((i) => statusPriority[i.status]));
          return aMin - bMin;
        })
    : [];

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => navigate("/translate")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to translate
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <OverallSummaryBanner status={result.overallStatus} summary={result.overallSummary} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
          <ResultsDonutChart sections={result.sections} />
        </motion.div>

        <div className="mt-8 space-y-6">
          {sortedSections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <ReportCard section={section} />
            </motion.div>
          ))}
        </div>

        {result.keyTakeaways.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-card-foreground">What This Means For You</h3>
            </div>
            <ul className="space-y-2">
              {result.keyTakeaways.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1 text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {result.questionsForDoctor.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Questions to Ask Your Doctor</h3>
            </div>
            <div className="space-y-3">
              {result.questionsForDoctor.map((q, i) => (
                <QuestionCard key={i} question={q} />
              ))}
            </div>
          </motion.div>
        )}

        {result.actionItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Action Items</h3>
            <ol className="space-y-2">
              {result.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning/20 text-xs font-bold text-warning">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </motion.div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/translate"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg"
            style={{ backgroundImage: "var(--gradient-button)" }}
          >
            <RefreshCw className="h-4 w-4" />
            Translate Another Report
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {saved ? <Check className="h-4 w-4 text-primary" /> : <BookmarkPlus className="h-4 w-4" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save This Report"}
          </button>
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ⚠️ MedMind is for educational purposes only. Always consult your healthcare provider for medical advice.
        </p>
      </div>
    </div>
  );
};

export default Results;
