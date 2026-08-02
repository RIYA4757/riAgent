export interface AgentEvent {
    type: string;
    timestamp: Date;
    data?: unknown;
}