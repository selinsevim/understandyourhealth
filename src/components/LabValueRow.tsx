import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface LabItem {
  testName: string;
  originalName: string;
  value: string;
  normalRange: string;
  status: "normal" | "watch" | "concern";
  simpleExplanation: string;
  detailedExplanation: string;
}

const LabValueRow = ({ item }: { item: LabItem }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{item.testName}</span>
            <span className="text-xs text-muted-foreground">({item.originalName})</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.simpleExplanation}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <div className="font-semibold text-foreground">{item.value}</div>
            <div className="text-xs text-muted-foreground">Ref: {item.normalRange}</div>
          </div>
          <StatusBadge status={item.status} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/50 px-4 py-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{item.detailedExplanation}</p>
        </div>
      )}
    </div>
  );
};

export default LabValueRow;
