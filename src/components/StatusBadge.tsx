import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

type Status = "normal" | "watch" | "concern";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const config: Record<Status, { icon: typeof CheckCircle2; label: string; className: string }> = {
  normal: {
    icon: CheckCircle2,
    label: "Normal",
    className: "status-normal",
  },
  watch: {
    icon: AlertTriangle,
    label: "Slightly Off",
    className: "status-watch",
  },
  concern: {
    icon: AlertCircle,
    label: "Talk to Doctor",
    className: "status-concern",
  },
};

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label ?? c.label}
    </span>
  );
};

export default StatusBadge;
