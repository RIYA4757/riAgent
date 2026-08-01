import { AgentConfig, AgentResult } from "../types";
import { Tool } from "../tools/Tool";
import { ToolRegistry } from "../tools/ToolRegistry";
import { AgentRunner } from "../runtime/AgentRunner";
import { MemoryStore } from "../memory/MemoryStore";
import { InputGuardrail } from "../guardrails/InputGuardrail";
import { OutputGuardrail } from "../guardrails/OutputGuardrail";
import { ToolGuardrail } from "../guardrails/ToolGuardrail";


export class Agent {
    private toolRegistry = new ToolRegistry();
    private memory = new MemoryStore();
    private inputGuardrails: InputGuardrail[] = [];
    private outputGuardrails: OutputGuardrail[] = [];
    private toolGuardrails: ToolGuardrail[] = [];

    constructor(private config: AgentConfig) { }
    addTool(tool: Tool) {
        this.toolRegistry.register(tool);
    }
            addInputGuardrail(guardrail: InputGuardrail) {
            this.inputGuardrails.push(guardrail);
        }

        addOutputGuardrail(guardrail: OutputGuardrail) {
            this.outputGuardrails.push(guardrail);
        }

        addToolGuardrail(guardrail: ToolGuardrail) {
            this.toolGuardrails.push(guardrail);
        }
    
    getTools() {
        return this.toolRegistry.getTools();
    }
    getMemory() {
        return this.memory;
    }
    getInstructions() {
        return this.config.instructions;
    }

    getModel() {
        return this.config.model;
    }

    getTool(name: string) {
        return this.toolRegistry.getTool(name);
    }
    getInputGuardrails() {
        return this.inputGuardrails;
    }

    getOutputGuardrails() {
        return this.outputGuardrails;
    }

    getToolGuardrails() {
        return this.toolGuardrails;
    }
            async run(
            userInput: string,
            sessionId = "default"
        ): Promise<AgentResult> {
            const runner = new AgentRunner();
            return runner.run(this, userInput, sessionId);
        }
    // constructor(private config: AgentConfig) { }

    // async run(userInput: string): Promise<AgentResult> {
    //     const runner = new AgentRunner();
    //     return runner.run(this, userInput);
    // }    // const tools = this.toolRegistry.getTools();
    // console.log("Available Tools:", tools);
    // //     const prompt = `
    // System Instructions:
    // ${this.config.instructions}

    // User:
    // ${userInput}
    // `;
    public async execute(userInput: string): Promise<AgentResult> {
        const output = await this.config.model.generate(userInput);
        //         const tools = this.toolRegistry.getTools();
        //         console.log("Available Tools:", tools);
        //         const toolDescriptions = tools
        //         .map(
        //             (tool) => `
        // Tool Name: ${tool.name}
        // Description: ${tool.description}
        // `
        //         )
        //             .join("\n");

        //         const prompt = `
        // You are an AI Agent.
        // Instructions:
        // ${this.config.instructions}
        // Available Tools:
        // ${toolDescriptions}
        // When you need a tool, respond ONLY with JSON like:
        // {
        //     "action":"tool",
        //     "tool":"toolName",
        //     "input":{}
        // }
        // Otherwise respond:
        // {
        // "action":"final",
        // "answer":"..."
        // }

        // User:
        // ${userInput}
        // `;
        //     const output = await this.config.model.generate(prompt);
        //     console.log(output);
        //     const response = JSON.parse(output);
        //     console.log(response);
        //     if (response.action === "tool") {
        //         const tool = this.toolRegistry.getTool(response.tool);

        //         if (!tool) {
        //             return {
        //                 output: `Tool ${response.tool} not found.`,
        //             };
        //         }

        //         const toolResult = await tool.execute(response.input);

        //         //   console.log("Tool Result:", toolResult);

        //         //   return {
        //         //       output: JSON.stringify(toolResult),
        //         //   };
        //         const finalPrompt = `
        // You are the AI agent.
        // The tool returned:
        // ${JSON.stringify(toolResult)}
        // Answer the user's original question naturally.
        // Original Question:
        // ${userInput}
        // `;
        //         const finalAnswer = await this.config.model.generate(finalPrompt);
        //         return {
        //             output: finalAnswer,
        //         };
        //     }
        return {
            output,
        };
    }
}