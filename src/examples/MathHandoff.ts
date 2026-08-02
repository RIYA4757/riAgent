import { Agent, OpenAIProvider } from "@/sdk";
import { calculatorTool } from "./calculatorTool";
import { Handoff } from "@/sdk/handoffs/Handoff";

const mathAgent = new Agent({
    instructions:
        "You are a mathematics assistant. Always use the calculator tool whenever calculations are required.",
    model: new OpenAIProvider(),
});

mathAgent.addTool(calculatorTool);

export const mathHandoff: Handoff = {
    agentName: "Math Agent",

    canHandle(input: string) {
        const text = input.toLowerCase();

        return (
            text.includes("calculate") ||
            text.includes("+") ||
            text.includes("-") ||
            text.includes("*") ||
            text.includes("/") ||
            text.includes("multiply") ||
            text.includes("divide")
        );
    },

    async execute(input, sessionId) {
        return mathAgent.run(input, sessionId);
    },
};