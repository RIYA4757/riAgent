export interface AgentConfig {
  name?: string;
  instructions: string;
  model: ModelProvider;
}

export interface AgentResult {
  output: string;
}

export interface ModelProvider {
  generate(prompt: string): Promise<string>;
}