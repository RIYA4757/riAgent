import { AgentEvent } from "./AgentEvent";

export class EventEmitter {
    private listeners: ((event: AgentEvent) => void)[] = [];

    on(listener: (event: AgentEvent) => void) {
        this.listeners.push(listener);
    }

    emit(event: AgentEvent) {
        for (const listener of this.listeners) {
            listener(event);
        }
    }
}