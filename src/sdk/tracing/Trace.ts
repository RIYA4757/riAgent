export interface Trace {
    runId: string;
    agentName: string;
    startedAt: Date;
    finishedAt?: Date;
    events: unknown[];
}