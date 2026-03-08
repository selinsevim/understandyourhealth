import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  sections: {
    items: { status: "normal" | "watch" | "concern" }[];
  }[];
}

const STATUS_COLORS = {
  normal: "hsl(160, 84%, 30%)",
  watch: "hsl(38, 92%, 50%)",
  concern: "hsl(347, 77%, 50%)",
};

const STATUS_LABELS = {
  normal: "Normal",
  watch: "Watch",
  concern: "Concern",
};

const ResultsDonutChart = ({ sections }: Props) => {
  const counts = { normal: 0, watch: 0, concern: 0 };
  sections.forEach((s) => s.items.forEach((i) => counts[i.status]++));
  const total = counts.normal + counts.watch + counts.concern;
  if (total === 0) return null;

  const data = (["normal", "watch", "concern"] as const)
    .filter((k) => counts[k] > 0)
    .map((k) => ({ name: STATUS_LABELS[k], value: counts[k], color: STATUS_COLORS[k], key: k }));

  const normalPct = Math.round((counts.normal / total) * 100);

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5">
      <div className="relative h-28 w-28 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={50}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--card))"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">{normalPct}%</span>
          <span className="text-[10px] text-muted-foreground">normal</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="mb-2 font-display text-sm font-semibold text-foreground">Results Breakdown</h4>
        <div className="space-y-1.5">
          {data.map((d) => (
            <div key={d.key} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium text-foreground">
                {d.value} of {total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDonutChart;
