import Navbar from "@/components/Navbar";
import { Clock, FileText } from "lucide-react";

const History = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground">Report History</h1>
        <p className="mt-2 text-muted-foreground">Your previously translated reports will appear here.</p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-medium text-foreground">No reports yet</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Once you translate a report and save it, it will show up here for easy access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
