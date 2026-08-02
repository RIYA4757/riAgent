import { Agent, OpenAIProvider } from "@/sdk";
import { Handoff } from "@/sdk/handoffs/Handoff";

const codingAgent = new Agent({
    instructions: `
You are a coding assistant.

Help users with:
- Programming
- Debugging
- Algorithms
- Data Structures
- LeetCode
- Code explanations
`,
    model: new OpenAIProvider(),
});


export const codingHandoff: Handoff = {
    agentName: "Coding Agent",

    canHandle(input: string) {
        const text = input.toLowerCase();

        return (
            text.includes("code") ||
            text.includes("javascript") ||
            text.includes("typescript") ||
            text.includes("python") ||
            text.includes("java") ||
            text.includes("React") ||
            text.includes("c") ||
            text.includes("c++") ||
            text.includes("node js") ||
            text.includes("next.js") ||
            text.includes("bug") ||
            text.includes("algorithm") ||
            text.includes("linked list") ||
            text.includes("binary tree") ||
            text.includes("array") ||
            text.includes("leetcode") ||
            text.includes("bug")
        );
    },

    async execute(input, sessionId) {
        return codingAgent.run(input, sessionId);
    },
};