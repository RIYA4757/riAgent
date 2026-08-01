export interface GuardrailResult {
    allowed: boolean;
    reason?: string;
}

export interface Guardrail<T = unknown> {
    check(input: T): Promise<GuardrailResult>;
}