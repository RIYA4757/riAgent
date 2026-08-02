import { z } from "zod";
import { Agent, OpenAIProvider } from "@/sdk";

const agent = new Agent({
    instructions: "You are a helpful AI assistant.",
    model: new OpenAIProvider(),
});

agent.setStructuredOutput({
    schema: z.object({
        country: z.string(),
        capital: z.string(),
        population: z.number(),
    }),
    description: `
{
  "country": string,
  "capital": string,
  "population": number
}
`,
});

const result = await agent.run("Tell me about India");

console.log(result.output);

agent.clearStructuredOutput();