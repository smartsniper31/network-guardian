import { ReportView } from "@/components/reports/report-view";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Weekly Reports</h1>
        <p className="text-muted-foreground">
          Generate AI-powered summaries of your network's activity and security.
        </p>
      </div>
      <ReportView />
    </div>
  );
}
