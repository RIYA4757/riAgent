import { z } from "zod";
import { Tool } from "@/sdk";

export const dateTimeTool: Tool = {
  name: "dateTime",

 description: "Returns the current date and time in the configured timezone.",

  schema: z.object({}),

  execute: async () => {
  const now = new Date();

  return {
    iso: now.toISOString(),
    local: now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    }),
    timestamp: now.getTime(),
  };
},
};