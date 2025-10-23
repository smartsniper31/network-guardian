import { LogsView } from "@/components/logs/logs-view";

export default function LogsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Logs & History</h1>
                <p className="text-muted-foreground">
                    Review a comprehensive history of all actions and system events.
                </p>
            </div>
            <LogsView />
        </div>
    );
}
