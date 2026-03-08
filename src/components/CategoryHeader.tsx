import {
  Heart, Wind, Flame, Droplets, Activity, Stethoscope, Baby,
  Shield, Bone, Brain, Apple, Beaker, type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Cardiovascular: Heart,
  Respiratory: Wind,
  Metabolic: Flame,
  Hematology: Droplets,
  Hepatic: Activity,
  Renal: Droplets,
  Thyroid: Activity,
  Gynecological: Baby,
  Immunology: Shield,
  Musculoskeletal: Bone,
  Neurological: Brain,
  Nutritional: Apple,
  Other: Beaker,
};

const statusColors = {
  normal: "bg-primary/10 text-primary border-primary/20",
  watch: "bg-warning/10 text-warning border-warning/20",
  concern: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusDots = {
  normal: "bg-primary",
  watch: "bg-warning",
  concern: "bg-destructive",
};

interface CategoryHeaderProps {
  category: string;
  status: "normal" | "watch" | "concern";
}

const CategoryHeader = ({ category, status }: CategoryHeaderProps) => {
  const Icon = categoryIcons[category] || Stethoscope;

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${statusColors[status]}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h2 className="font-display text-base font-bold">{category}</h2>
      </div>
      <span className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`} />
    </div>
  );
};

export default CategoryHeader;
