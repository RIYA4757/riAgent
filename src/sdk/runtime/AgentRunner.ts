import { Agent } from "../agent/Agent";
import { Message } from "../memory/Session";

export class AgentRunner {
    async run(
        agent: Agent, 
        userInput: string,
        sessionId: string
    ) {
        const tools = agent.getTools();
        const session = agent.getMemory().getSession("sessionId");
        for (const guardrail of agent.getInputGuardrails()) {
           const result = await guardrail.check(userInput);

            if (!result.allowed) {
                return {
                    output: result.reason ?? "Input blocked.",
                };
            }
        }
        session.addMessage({
            role: "user",
            content: userInput,
        });
        const toolDescriptions = tools
            .map(
                (tool) => `
Tool Name: ${tool.name}
Description: ${tool.description}
`
            )
            .join("\n");
        const history = session
            .getMessages()
            .map(
                (message) =>
                    `${message.role.toUpperCase()}: ${message.content}`
            )
            .join("\n");

        const prompt = `
You are an AI Agent.

Instructions:
${agent.getInstructions()}

Available Tools:
${toolDescriptions}

A user request may require MULTIPLE tools.

Call ONE tool at a time.

When you need a tool, respond ONLY with JSON:

{
  "action":"tool",
  "tool":"toolName",
  "input":{}
}

After each tool result, you will be asked again what to do next.

Continue requesting tools until every part of the user's request has been completed.

Only then respond with:

{
  "action":"final",
  "answer":"..."
}

Otherwise respond:
{
  "action":"final",
  "answer":"..."
}

Conversation History:

${history}

Current User:

${userInput}
`;
        console.log("========== PROMPT ==========");
        console.log(prompt);
        console.log("============================");
        const output = await agent.getModel().generate(prompt);

        console.log(output);

        const response = JSON.parse(output);

        console.log(response);
        let scratchpad = "";
        // if (response.action === "tool") {
        //   const tool = agent.getTool(response.tool);
        let currentResponse = response;
        let iterations = 0;

        while (currentResponse.action === "tool" && iterations < 5) {
            iterations++;
            const tool = agent.getTool(currentResponse.tool);
            if (!tool) {
                return {
                    output: `Tool ${currentResponse.tool} not found.`,
                };
            }

            // const toolResult = await tool.execute(currentResponse.input);
            let toolResult;

                try {
                const validation = tool.schema.safeParse(currentResponse.input);
                if (!validation.success) {
                    return {
                        output: `Invalid input for tool "${tool.name}": ${validation.error.message}`,
                    };
                }
                toolResult = await tool.execute(validation.data);
            } catch (error) {
                return {
                    output: `Tool "${currentResponse.tool}" failed: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`,
                };
            }
            scratchpad += `
            Tool Executed:
            ${currentResponse.tool}
            Input:
            ${JSON.stringify(currentResponse.input)}
            Output:
            ${JSON.stringify(toolResult)}
            ------------------------
        `;
            const nextPrompt = `
            You are an AI Agent.

            Instructions:
            ${agent.getInstructions()}

            Conversation History:

            ${history}

            Current User:

            ${userInput}

            Tools already executed:

            ${scratchpad}

            Available Tools:

            ${toolDescriptions}

            If more tools are required,
            respond ONLY with:

            {
            "action":"tool",
            "tool":"toolName",
            "input":{}
            }

            If the user's request is completely fulfilled,
            respond ONLY with:

            {
            "action":"final",
            "answer":"..."
            }
            `;

            const nextOutput = await agent.getModel().generate(nextPrompt);

            console.log(nextOutput);

            currentResponse = JSON.parse(nextOutput);
        }
        if (currentResponse.action === "final") {
                for (const guardrail of agent.getOutputGuardrails()) {

                    const result = await guardrail.check(currentResponse.answer);

                    if (!result.allowed) {
                     return {
                        output: result.reason ?? "Output blocked by guardrail.",
                    };
                }
            }
            session.addMessage({
                role: "assistant",
                content: currentResponse.answer,
            });
            return {
                output: currentResponse.answer,
            };
        }

        return {
            output: "Maximum iterations reached.",
        };
    }
}   