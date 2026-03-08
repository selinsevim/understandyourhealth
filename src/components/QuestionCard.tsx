import { Copy, Check } from "lucide-react";
import { useState } from "react";

const QuestionCard = ({ question }: { question: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <span className="mt-0.5 text-lg">💬</span>
      <p className="flex-1 text-sm leading-relaxed text-card-foreground">{question}</p>
      <button
        onClick={copy}
        className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Copy question"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default QuestionCard;
