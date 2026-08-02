export interface ModelProvider {
    generate(prompt: string): Promise<string>;

    generateStream?(
        prompt: string
    ): AsyncGenerator<string>;
}