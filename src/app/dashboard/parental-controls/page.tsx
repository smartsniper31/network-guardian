import { ControlsView } from "@/components/parental-controls/controls-view";

export default function ParentalControlsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">الرقابة الأبوية</h1>
        <p className="text-muted-foreground">
          إدارة جداول الوصول والقيود لجميع الأجهزة المتصلة.
        </p>
      </div>
      <ControlsView />
    </div>
  );
}
