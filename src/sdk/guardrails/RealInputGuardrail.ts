import { InputGuardrail } from "./InputGuardrail";

export class RealInputGuardrail implements InputGuardrail {
    private readonly blockedWords = [
      "idiot",
      "stupid",
      "hate",
    ];
    async check(input: string) {
      const lower = input.toLowerCase();
    const found = this.blockedWords.some(word => lower.includes(word));

    if (found) {
      return {
        allowed: false,
        reason: "Input blocked by guardrail.",
      };
    }

    return {
      allowed: true,
      };
  }
}