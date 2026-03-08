interface Props {
  value: string;
  normalRange: string;
  status: "normal" | "watch" | "concern";
}

const parseNumber = (s: string): number | null => {
  const match = s.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
};

const parseRange = (range: string): { min: number; max: number } | null => {
  // Handle formats: "4.5-11.0", "<200", ">40", "0.4-4.0"
  const dashMatch = range.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (dashMatch) return { min: parseFloat(dashMatch[1]), max: parseFloat(dashMatch[2]) };

  const ltMatch = range.match(/<\s*([\d.]+)/);
  if (ltMatch) return { min: 0, max: parseFloat(ltMatch[1]) };

  const gtMatch = range.match(/>\s*([\d.]+)/);
  if (gtMatch) return { min: parseFloat(gtMatch[1]), max: parseFloat(gtMatch[1]) * 2 };

  return null;
};

const LabValueGauge = ({ value, normalRange, status }: Props) => {
  const numValue = parseNumber(value);
  const range = parseRange(normalRange);

  if (numValue === null || range === null) return null;

  // Build a wider view range (30% padding on each side)
  const span = range.max - range.min || range.max * 0.5;
  const padding = span * 0.35;
  const viewMin = Math.max(0, range.min - padding);
  const viewMax = range.max + padding;
  const viewSpan = viewMax - viewMin;

  // Positions as percentages
  const normalStart = ((range.min - viewMin) / viewSpan) * 100;
  const normalEnd = ((range.max - viewMin) / viewSpan) * 100;
  const markerPos = Math.max(0, Math.min(100, ((numValue - viewMin) / viewSpan) * 100));

  const dotColor =
    status === "normal"
      ? "bg-success"
      : status === "watch"
      ? "bg-warning"
      : "bg-destructive";

  return (
    <div className="mt-2 w-full">
      <div className="relative h-2.5 w-full rounded-full bg-muted">
        {/* Normal range zone */}
        <div
          className="absolute top-0 h-full rounded-full bg-success/20"
          style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }}
        />
        {/* Patient value marker */}
        <div
          className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow-sm ${dotColor}`}
          style={{ left: `${markerPos}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>Low</span>
        <span>Normal range</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default LabValueGauge;
