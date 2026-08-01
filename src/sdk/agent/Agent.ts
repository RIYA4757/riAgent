import { AgentConfig, AgentResult } from "../types";
import { Tool } from "../tools/Tool";
import { ToolRegistry } from "../tools/ToolRegistry";

export class Agent {
    private toolRegistry = new ToolRegistry();
    addTool(tool: Tool) {
  this.toolRegistry.register(tool);
}
getTools() {
  return this.toolRegistry.getTools();
}
  constructor(private config: AgentConfig) {}

  async run(userInput: string): Promise<AgentResult> {
    const tools = this.toolRegistry.getTools();
    console.log("Available Tools:", tools);
    const prompt = `
System Instructions:
${this.config.instructions}

User:
${userInput}
`;

    const output = await this.config.model.generate(prompt);

    return {
      output,
    };
  }
}