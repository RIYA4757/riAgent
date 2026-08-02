import { Agent, OpenAIProvider } from "@/sdk";
import { Handoff } from "@/sdk/handoffs/Handoff";

const researchAgent = new Agent({
    instructions: `
You are a research assistant.

Provide detailed, well-structured explanations.
`,
    model: new OpenAIProvider(),
});

export const researchHandoff: Handoff = {
    agentName: "Research Agent",

    canHandle(input: string) {
        const text = input.toLowerCase();

        return (
            text.includes("research") ||
            text.includes("explain") ||
            text.includes("history") ||
            text.includes("tell me about")
        );
    },

    async execute(input, sessionId) {
        return researchAgent.run(input, sessionId);
    },
};