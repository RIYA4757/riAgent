import { AgentResult } from "../types";

export interface Handoff {
    agentName: string;

    canHandle(input: string): boolean;

    execute(
        input: string,
        sessionId: string
    ): Promise<AgentResult>;
}