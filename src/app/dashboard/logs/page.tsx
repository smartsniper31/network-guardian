import { LogsView } from "@/components/logs/logs-view";

export default function LogsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Journaux & Historique</h1>
                <p className="text-muted-foreground">
                    Consultez un historique complet de toutes les actions et événements système.
                </p>
            </div>
            <LogsView />
        </div>
    );
}
