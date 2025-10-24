import { ControlsView } from "@/components/parental-controls/controls-view";

export default function ParentalControlsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Contrôle parental</h1>
        <p className="text-muted-foreground">
          Gérez les plannings d'accès et les restrictions pour tous les appareils connectés.
        </p>
      </div>
      <ControlsView />
    </div>
  );
}
