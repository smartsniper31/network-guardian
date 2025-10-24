import { LogsView } from "@/components/logs/logs-view";

export default function LogsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">السجلات والتاريخ</h1>
                <p className="text-muted-foreground">
                    مراجعة سجل كامل لجميع إجراءات وأحداث النظام.
                </p>
            </div>
            <LogsView />
        </div>
    );
}
