import { ReportView } from "@/components/reports/report-view";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">التقارير الأسبوعية</h1>
        <p className="text-muted-foreground">
          إنشاء ملخصات مدعومة بالذكاء الاصطناعي لنشاط شبكتك وأمانها.
        </p>
      </div>
      <ReportView />
    </div>
  );
}
