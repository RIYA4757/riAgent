import { Guardrail } from "./Guardrail";

export interface ToolGuardrail
    extends Guardrail<{
        tool: string;
        input: unknown;
    }> {}