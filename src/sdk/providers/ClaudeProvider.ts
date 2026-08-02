import { ModelProvider } from "./ModelProvider";

export interface ClaudeProviderOptions {
    apiKey?: string;
}

export class ClaudeProvider implements ModelProvider {
    constructor(private options: ClaudeProviderOptions = {}) {}

    async generate(_prompt: string): Promise<string> {
        if (!this.options.apiKey) {
            throw new Error(
                "Claude API key not configured."
            );
        }

        throw new Error(
            "Claude provider integration is not implemented yet."
        );
    }

    async *generateStream(_prompt: string): AsyncGenerator<string> {
        throw new Error(
            "Streaming is not implemented for ClaudeProvider."
        );
    }
}