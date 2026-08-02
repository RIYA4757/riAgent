import { Agent, OpenAIProvider } from "@/sdk";
import { weatherTool } from "./weatherTool";
import { Handoff } from "@/sdk/handoffs/Handoff";

const weatherAgent = new Agent({
    instructions:
        "You are a weather assistant. Always use the weather tool whenever weather information is requested.",
    model: new OpenAIProvider(),
});

weatherAgent.addTool(weatherTool);

export const weatherHandoff: Handoff = {
    agentName: "Weather Agent",

    canHandle(input: string) {
        return input.toLowerCase().includes("weather");
    },

    async execute(input, sessionId) {
        return weatherAgent.run(input, sessionId);
    },
};