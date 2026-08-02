import { ZodSchema } from "zod";

export interface StructuredOutput<T = unknown> {
    schema: ZodSchema<T>;
    description?: string;

}