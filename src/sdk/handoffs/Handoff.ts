export interface Handoff {
    canHandle(input: string): boolean;
    agentName: string;
}