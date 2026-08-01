import OpenAI from "openai";
import { ModelProvider } from "../types";

export class OpenAIProvider implements ModelProvider {
  private client: OpenAI;
  private model: string;

  constructor(
    apiKey = process.env.OPENAI_API_KEY!,
    model = "gpt-4.1-mini"
  ) {
    this.client = new OpenAI({
      apiKey,
    });

    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      input: prompt,
    });

    return response.output_text;
  }
}