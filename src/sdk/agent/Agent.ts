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
    constructor(private config: AgentConfig) { }

    async run(userInput: string): Promise<AgentResult> {
        const tools = this.toolRegistry.getTools();
        console.log("Available Tools:", tools);
        //     const prompt = `
        // System Instructions:
        // ${this.config.instructions}

        // User:
        // ${userInput}
        // `;
        const toolDescriptions = tools
            .map(
                (tool) => `
Tool Name: ${tool.name}
Description: ${tool.description}
`
            )
            .join("\n");

        const prompt = `
You are an AI Agent.

Instructions:
${this.config.instructions}

Available Tools:
${toolDescriptions}

When you need a tool, respond ONLY with JSON like:

{
  "action":"tool",
  "tool":"toolName",
  "input":{}
}

Otherwise respond:

{
  "action":"final",
  "answer":"..."
}

User:
${userInput}
`;

        const output = await this.config.model.generate(prompt);
        console.log(output);
        const response = JSON.parse(output);
        console.log(response);
        if (response.action === "tool") {
            const tool = this.toolRegistry.getTool(response.tool);

            if (!tool) {
                return {
                    output: `Tool ${response.tool} not found.`,
                };
            }

            const toolResult = await tool.execute(response.input);

            //   console.log("Tool Result:", toolResult);

            //   return {
            //       output: JSON.stringify(toolResult),
            //   };
            const finalPrompt = `
    You are the AI agent.
    The tool returned:
    ${JSON.stringify(toolResult)}
    Answer the user's original question naturally.
    Original Question:
    ${userInput}
    `;
            const finalAnswer = await this.config.model.generate(finalPrompt);
            return {
                output: finalAnswer,
            };
        }
        return {
            output,
        };
    }
}