import { ControlsView } from "@/components/parental-controls/controls-view";

export default function ParentalControlsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Parental Controls</h1>
        <p className="text-muted-foreground">
          Manage access schedules and restrictions for all connected devices.
        </p>
      </div>
      <ControlsView />
    </div>
  );
}
