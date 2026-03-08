import { Heart, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

type OverallStatus = "all_clear" | "watch" | "concern";

interface Props {
  status: OverallStatus;
  summary: string;
}

const statusMap: Record<OverallStatus, { headline: string; badgeStatus: "normal" | "watch" | "concern"; badgeLabel: string; icon: typeof Heart; iconBg: string }> = {
  all_clear: {
    headline: "Your results look great!",
    badgeStatus: "normal",
    badgeLabel: "All Clear",
    icon: ShieldCheck,
    iconBg: "bg-success/10 text-success",
  },
  watch: {
    headline: "Your results look mostly good! Here's what to know.",
    badgeStatus: "watch",
    badgeLabel: "Some Items to Watch",
    icon: AlertTriangle,
    iconBg: "bg-warning/10 text-warning",
  },
  concern: {
    headline: "Some results need your attention.",
    badgeStatus: "concern",
    badgeLabel: "Needs Attention",
    icon: AlertCircle,
    iconBg: "bg-destructive/10 text-destructive",
  },
};

const OverallSummaryBanner = ({ status, summary }: Props) => {
  const s = statusMap[status];
  const Icon = s.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${s.iconBg}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-card-foreground sm:text-2xl">{s.headline}</h2>
            <StatusBadge status={s.badgeStatus} label={s.badgeLabel} />
          </div>
          <p className="leading-relaxed text-muted-foreground">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default OverallSummaryBanner;
