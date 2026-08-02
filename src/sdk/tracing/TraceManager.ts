import { Trace } from "./Trace";

export class TraceManager {

    private traces: Trace[] = [];

    start(trace: Trace) {
        this.traces.push(trace);
    }

    finish(runId: string) {
        const trace = this.traces.find(t => t.runId === runId);

        if (trace) {
            trace.finishedAt = new Date();
        }
    }

    getAll() {
        return this.traces;
    }
    addEvent(runId: string, event: unknown) {
    const trace = this.traces.find(t => t.runId === runId);

    if (trace) {
        trace.events.push(event);
    }
}
}