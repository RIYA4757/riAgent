import { NextResponse } from "next/server";
import { Agent, OpenAIProvider } from "@/sdk";
import { calculatorTool } from "@/examples/calculatorTool";
import { weatherTool } from "@/examples/weatherTool";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const agent = new Agent({
      instructions: "You are a helpful AI assistant.",
      model: new OpenAIProvider(),
    });
    agent.addTool(weatherTool);
    agent.addTool(calculatorTool);
    const result = await agent.run(message);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Agent failed" },
      { status: 500 }
    );
  }
}