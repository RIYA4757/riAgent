import { ModelProvider } from "./ModelProvider";

export interface GeminiProviderOptions {
    apiKey?: string;
}

export class GeminiProvider implements ModelProvider {
    constructor(private options: GeminiProviderOptions = {}) {}

    async generate(_prompt: string): Promise<string> {
        if (!this.options.apiKey) {
            throw new Error(
                "Gemini API key not configured."
            );
        }

        throw new Error(
            "Gemini provider integration is not implemented yet."
        );
    }

    async *generateStream(_prompt: string): AsyncGenerator<string> {
        throw new Error(
            "Streaming is not implemented for GeminiProvider."
        );
    }
}