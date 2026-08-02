import { Handoff } from "@/sdk/handoffs/Handoff";

export const weatherHandoff: Handoff = {
    agentName: "Weather Agent",

    canHandle(input: string) {
        return input.toLowerCase().includes("weather");
    },
};