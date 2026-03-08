import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, BookmarkPlus, ListChecks, MessageCircleQuestion } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import OverallSummaryBanner from "@/components/OverallSummaryBanner";
import ReportCard from "@/components/ReportCard";
import QuestionCard from "@/components/QuestionCard";
import ResultsDonutChart from "@/components/ResultsDonutChart";

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
  const navigate = useNavigate();

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

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/translate")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to translate
        </button>

        {/* Overall Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <OverallSummaryBanner status={result.overallStatus} summary={result.overallSummary} />
        </motion.div>

        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
          <ResultsDonutChart sections={result.sections} />
        </motion.div>

        {/* Report Sections */}
        <div className="mt-8 space-y-6">
          {result.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <ReportCard section={section} />
            </motion.div>
          ))}
        </div>

        {/* Key Takeaways */}
        {result.keyTakeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-2xl border border-border bg-card p-6"
          >
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

        {/* Questions for Doctor */}
        {result.questionsForDoctor.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
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

        {/* Action Items */}
        {result.actionItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 rounded-2xl border border-warning/30 bg-warning/5 p-6"
          >
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

        {/* Bottom Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/translate"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Translate Another Report
          </Link>
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted">
            <BookmarkPlus className="h-4 w-4" />
            Save This Report
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
