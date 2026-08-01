import { Agent } from "../agent/Agent";

export class AgentRunner {
  async run(agent: Agent, userInput: string) {
    const tools = agent.getTools();

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
${agent.getInstructions()}

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

    const output = await agent.getModel().generate(prompt);

    console.log(output);

    const response = JSON.parse(output);

    console.log(response);

    // if (response.action === "tool") {
    //   const tool = agent.getTool(response.tool);
        let currentResponse = response;
        let iterations = 0;

        while (currentResponse.action === "tool" && iterations < 5) {
            iterations++;
        const tool = agent.getTool(currentResponse.tool);
      if (!tool) {
        return {
          output: `Tool ${response.tool} not found.`,
        };
      }

      const toolResult = await tool.execute(currentResponse.input);

      const nextPrompt = `
You are the AI agent.

The user originally asked:

${userInput}

The tool "${currentResponse.tool}" returned:

${JSON.stringify(toolResult)}

If another tool is required,
respond again with

{
 "action":"tool",
 "tool":"...",
 "input":{}
}

Otherwise respond

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
    return {
        output: currentResponse.answer,
    };
}

return {
    output: "Maximum iterations reached.",
};
}
}   