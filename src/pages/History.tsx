import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, FileText, Trash2, Eye, Users } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import CategoryHeader from "@/components/CategoryHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
}

interface Report {
  id: string;
  title: string;
  overall_status: string;
  created_at: string;
  result: any;
  member_id: string | null;
}

const statusPriority: Record<string, number> = { concern: 0, watch: 1, normal: 2, all_clear: 2 };

const getReportCategories = (report: Report): string[] => {
  const sections = report.result?.sections;
  if (!Array.isArray(sections)) return ["Other"];
  const cats = new Set<string>();
  sections.forEach((s: any) => cats.add(s.category || "Other"));
  return cats.size > 0 ? [...cats] : ["Other"];
};

const getWorstStatus = (reports: Report[]): "normal" | "watch" | "concern" => {
  let worst = 2;
  reports.forEach((r) => {
    const sections = r.result?.sections;
    if (!Array.isArray(sections)) return;
    sections.forEach((s: any) => {
      s.items?.forEach((item: any) => {
        const p = statusPriority[item.status] ?? 2;
        if (p < worst) worst = p;
      });
    });
  });
  return worst === 0 ? "concern" : worst === 1 ? "watch" : "normal";
};

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [filterMember, setFilterMember] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const [reportsRes, membersRes] = await Promise.all([
        supabase
          .from("reports")
          .select("id, title, overall_status, created_at, result, member_id")
          .order("created_at", { ascending: false }),
        supabase
          .from("family_members")
          .select("id, name")
          .order("created_at", { ascending: true }),
      ]);
      if (!reportsRes.error && reportsRes.data) setReports(reportsRes.data);
      if (!membersRes.error && membersRes.data) setMembers(membersRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading]);

  const handleView = (report: Report) => {
    sessionStorage.setItem("medmind_result", JSON.stringify(report.result));
    navigate("/results");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete report");
    } else {
      setReports((r) => r.filter((rep) => rep.id !== id));
      toast.success("Report deleted");
    }
  };

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return null;
    return members.find((m) => m.id === memberId)?.name || null;
  };

  // Filter reports by selected member
  const filteredReports = filterMember === "all"
    ? reports
    : filterMember === "myself"
    ? reports.filter((r) => !r.member_id)
    : reports.filter((r) => r.member_id === filterMember);

  // Group reports by category
  const groupedByCategory = (() => {
    const map = new Map<string, Report[]>();
    filteredReports.forEach((report) => {
      const cats = getReportCategories(report);
      cats.forEach((cat) => {
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(report);
      });
    });
    return [...map.entries()].sort((a, b) => {
      const aStatus = getWorstStatus(a[1]);
      const bStatus = getWorstStatus(b[1]);
      return (statusPriority[aStatus] ?? 2) - (statusPriority[bStatus] ?? 2);
    });
  })();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground">Report History</h1>
        <p className="mt-2 text-muted-foreground">Your previously translated reports.</p>

        {!user ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">Sign in to see your history</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create an account to save and view your past reports.
            </p>
            <Link
              to="/auth"
              className="mt-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-button)" }}
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="mt-12 text-center text-muted-foreground">Loading…</div>
        ) : reports.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">No reports yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Once you translate a report and save it, it will show up here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {groupedByCategory.map(([category, catReports]) => (
              <div key={category} className="space-y-3">
                <CategoryHeader category={category} status={getWorstStatus(catReports)} />
                <div className="space-y-2 pl-0 sm:pl-2">
                  {catReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-card-foreground">{report.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(report.created_at), "MMM d, yyyy · h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={report.overall_status as any} />
                        <button
                          onClick={() => handleView(report)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
