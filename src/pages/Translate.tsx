import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Upload as UploadIcon, Sparkles, Globe, Users, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLoader from "@/components/AnimatedLoader";
import UploadDropzone from "@/components/UploadDropzone";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const SAMPLE_REPORT = `CBC Results: WBC 7.2 K/uL (ref 4.5-11.0), RBC 4.8 M/uL (ref 4.2-5.4), Hemoglobin 14.2 g/dL (ref 13.5-17.5), Hematocrit 42% (ref 41-53), Platelets 320 K/uL (ref 150-400). Lipid Panel: Total Cholesterol 215 mg/dL (ref <200), LDL 142 mg/dL (ref <100), HDL 45 mg/dL (ref >40), Triglycerides 140 mg/dL (ref <150). TSH 2.1 mIU/L (ref 0.4-4.0).`;

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

interface FamilyMember {
  id: string;
  name: string;
  age: string | null;
  conditions: string | null;
}

const Translate = () => {
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [reportText, setReportText] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Check for payment success callback
  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "success" && sessionId) {
      // Verify payment
      const verifyPayment = async () => {
        try {
          const { data, error } = await supabase.functions.invoke("verify-payment", {
            body: { sessionId },
          });
          if (data?.paid) {
            setIsPaid(true);
            // Restore form data from sessionStorage
            const savedText = sessionStorage.getItem("medmind_pending_report");
            const savedAge = sessionStorage.getItem("medmind_pending_age");
            const savedConditions = sessionStorage.getItem("medmind_pending_conditions");
            const savedLanguage = sessionStorage.getItem("medmind_pending_language");
            const savedMemberId = sessionStorage.getItem("medmind_pending_member_id");
            if (savedText) setReportText(savedText);
            if (savedAge) setAge(savedAge);
            if (savedConditions) setConditions(savedConditions);
            if (savedLanguage) setLanguage(savedLanguage);
            if (savedMemberId) setSelectedMemberId(savedMemberId);
            // Clean up URL params
            setSearchParams({});
          }
        } catch (err) {
          console.error("Payment verification failed:", err);
        }
      };
      verifyPayment();
    } else if (payment === "cancelled") {
      setError("Payment was cancelled. You can try again when you're ready.");
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Auto-translate after successful payment verification
  useEffect(() => {
    if (isPaid && reportText.trim()) {
      handleTranslateAfterPayment();
    }
  }, [isPaid]);

  useEffect(() => {
    if (searchParams.get("sample") === "true") {
      setReportText(SAMPLE_REPORT);
    }
    if (searchParams.get("demo") === "true") {
      setReportText(SAMPLE_REPORT);
      setIsDemo(true);
    }
  }, [searchParams]);

  // Fetch family members
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("family_members")
        .select("id, name, age, conditions")
        .order("created_at", { ascending: true });
      if (data) setMembers(data);
    };
    fetch();
  }, [user]);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    if (memberId === "") {
      setAge("");
      setConditions("");
      return;
    }
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setAge(member.age || "");
      setConditions(member.conditions || "");
    }
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setPdfLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textParts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(" ");
        textParts.push(pageText);
      }
      const extracted = textParts.join("\n\n").trim();
      if (!extracted) {
        setError("Could not extract text from this PDF. It may be a scanned image — try pasting the text instead.");
      } else {
        setReportText(extracted);
        setTab("paste");
      }
    } catch (err) {
      console.error("PDF parse error:", err);
      setError("Failed to read this PDF. Please try pasting the text instead.");
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const handleTranslateAfterPayment = async () => {
    if (!reportText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("translate-report", {
        body: { reportText: reportText.trim(), age, conditions, language },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      sessionStorage.setItem("medmind_result", JSON.stringify(data));
      sessionStorage.setItem("medmind_report_text", reportText.trim());
      if (selectedMemberId) sessionStorage.setItem("medmind_member_id", selectedMemberId);
      else sessionStorage.removeItem("medmind_member_id");

      // Clean up pending data
      sessionStorage.removeItem("medmind_pending_report");
      sessionStorage.removeItem("medmind_pending_age");
      sessionStorage.removeItem("medmind_pending_conditions");
      sessionStorage.removeItem("medmind_pending_language");
      sessionStorage.removeItem("medmind_pending_member_id");

      navigate("/results");
    } catch (err: any) {
      console.error("Translation error:", err);
      setError("We had trouble reading this report. Try pasting just a section at a time.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!reportText.trim()) return;

    // Demo mode: translate for free with the sample report
    if (isDemo && reportText.trim() === SAMPLE_REPORT.trim()) {
      handleTranslateAfterPayment();
      return;
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    // Save form data before redirecting to payment
    sessionStorage.setItem("medmind_pending_report", reportText.trim());
    sessionStorage.setItem("medmind_pending_age", age);
    sessionStorage.setItem("medmind_pending_conditions", conditions);
    sessionStorage.setItem("medmind_pending_language", language);
    if (selectedMemberId) sessionStorage.setItem("medmind_pending_member_id", selectedMemberId);

    setPaymentLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-payment");
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        // Use anchor tag click to reliably open in new tab (preview iframe blocks window.open)
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPaymentLoading(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("Could not start the payment process. Please try again.");
      setPaymentLoading(false);
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
        {/* Demo banner */}
        {isDemo && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-primary">
              🎉 Free Demo Mode — Try a sample report to see how MedMind works!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              No payment or sign-up required for the demo.
            </p>
          </div>
        )}

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {isDemo ? "Try the Demo" : "Translate Your Report"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isDemo
              ? "See how we turn confusing lab results into plain, friendly language."
              : "Paste your lab results or doctor notes below. We'll explain everything in plain English."}
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
            <div>
              <UploadDropzone onFileSelect={handleFileSelect} />
              {pdfLoading && (
                <p className="mt-3 text-center text-sm text-muted-foreground animate-pulse">
                  Extracting text from PDF…
                </p>
              )}
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="mt-6">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Globe className="h-4 w-4 text-primary" />
            Output language
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  language === lang.code
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Member selector */}
        {user && members.length > 0 && (
          <div className="mt-6">
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" />
              Who is this report for?
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleMemberSelect("")}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedMemberId === ""
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                Myself
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMemberSelect(m.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedMemberId === m.id
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Optional context */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Age (optional)</label>
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
          disabled={!reportText.trim() || paymentLoading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDemo ? (
            <>
              <Sparkles className="h-5 w-5" />
              Try Demo — Free
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              {paymentLoading ? "Redirecting to payment…" : "Translate My Report — €1.00"}
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isDemo
            ? "🔒 Your data is processed securely. This demo uses a sample report."
            : "🔒 Secure payment via Stripe. Your report is processed securely and never stored without your permission."}
        </p>

        {!isDemo && (
          <div className="mt-4 text-center">
            <Link
              to="/translate?demo=true"
              className="text-sm font-medium text-primary hover:underline"
            >
              Not sure? Try a free demo first →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translate;
