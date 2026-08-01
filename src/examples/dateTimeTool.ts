import { z } from "zod";
import { Tool } from "@/sdk";

export const dateTimeTool: Tool = {
  name: "dateTime",

  description: "Returns the current date and time.",

  schema: z.object({}),

  execute: async () => {
  const now = new Date();

  return {
    iso: now.toISOString(),
    local: now.toString(),
    timestamp: now.getTime(),
  };
},
};