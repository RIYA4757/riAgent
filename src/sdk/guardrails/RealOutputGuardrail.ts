import { OutputGuardrail } from "./OutputGuardrail";

export class RealOutputGuardrail implements OutputGuardrail {
    // private readonly blockedWords = [
    //     "password",
    //     "secret",
    //     "api key",
    //     "token",
    // ];
    private readonly sensitivePatterns: RegExp[] = [
        // OpenAI API Key
        /sk-[A-Za-z0-9_-]{20,}/i,
        // Password assignment
        /password\s*[:=]\s*\S+/i,
        // API Key assignment
        /api\s*key\s*[:=]\s*\S+/i,
        // Generic Token assignment
        /token\s*[:=]\s*\S+/i,
        // Bearer Token
        /bearer\s+[A-Za-z0-9\-._~+/]+=*/i,
    ];
    async check(output: string) {
        console.log("Checking Output:", output);
        // const lower = output.toLowerCase();
        const found = this.sensitivePatterns.some(pattern => pattern.test(output));

        if (found) {
            console.log("Sensitive pattern detected.");
            return {
                allowed: false,
                reason: "Sensitive information detected in output.",
            };
        }

        return {
            allowed: true,
        };
    }
}