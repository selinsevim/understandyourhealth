import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, FileText, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  overall_status: string;
  created_at: string;
  result: any;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("id, title, overall_status, created_at, result")
        .order("created_at", { ascending: false });
      if (!error && data) setReports(data);
      setLoading(false);
    };
    fetchReports();
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
          <div className="mt-8 space-y-3">
            {reports.map((report) => (
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
        )}
      </div>
    </div>
  );
};

export default History;
