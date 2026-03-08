import LabValueRow from "./LabValueRow";
import { Beaker, Heart, Droplets, Activity, Brain, Bone, Eye, type LucideIcon } from "lucide-react";

interface ReportSection {
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
}

const sectionIcons: Record<string, LucideIcon> = {
  blood: Droplets,
  cholesterol: Heart,
  lipid: Heart,
  thyroid: Activity,
  brain: Brain,
  bone: Bone,
  eye: Eye,
};

const getIcon = (name: string): LucideIcon => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (lower.includes(key)) return icon;
  }
  return Beaker;
};

const ReportCard = ({ section }: { section: ReportSection }) => {
  const Icon = getIcon(section.sectionName);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-card-foreground">{section.sectionName}</h3>
      </div>
      <div>
        {section.items.map((item, i) => (
          <LabValueRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
