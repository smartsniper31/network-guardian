import { ReportView } from "@/components/reports/report-view";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Rapports hebdomadaires</h1>
        <p className="text-muted-foreground">
          Générez des résumés optimisés par IA de l'activité et de la sécurité de votre réseau.
        </p>
      </div>
      <ReportView />
    </div>
  );
}
