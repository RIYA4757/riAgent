import { z } from "zod";
import { Tool } from "@/sdk/tools/Tool";

export const weatherTool: Tool = {
  name: "getWeather",

  description: "Get current weather",

  schema: z.object({
    city: z.string(),
  }),

  async execute(input) {
    return {
      city: input.city,
      temperature: "29°C",
      condition: "Sunny",
    };
  },
};