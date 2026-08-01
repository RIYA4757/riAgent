import { z } from "zod";

export interface Tool<T = any> {
  name: string;
  description: string;
  schema: z.ZodSchema;
  execute(input: T): Promise<any>;
}