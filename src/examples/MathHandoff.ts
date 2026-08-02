import { Handoff } from "@/sdk/handoffs/Handoff";

export const mathHandoff: Handoff = {
    agentName: "Math Agent",

    canHandle(input: string) {
        return (
            input.includes("+") ||
            input.includes("-") ||
            input.includes("*") ||
            input.includes("/")
        );
    },
};