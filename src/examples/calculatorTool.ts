import { z } from "zod";
import { Tool } from "@/sdk/tools/Tool";

export const calculatorTool: Tool = {
  name: "calculator",

  description: "Simple calculator",

  schema: z.object({
    expression: z.string(),
  }),

  async execute(input) {
    const result = eval(input.expression);

    return {
      result,
    };
  },
};