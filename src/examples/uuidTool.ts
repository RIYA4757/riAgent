import { randomUUID } from "crypto";
import { z } from "zod";
import { Tool } from "@/sdk";

export const uuidTool: Tool = {
  name: "uuid",

  description: "Generate a random UUID.",

  schema: z.object({}),

  async execute() {
    return {
      uuid: randomUUID(),
    };
  },
};