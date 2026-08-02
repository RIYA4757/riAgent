import { NextResponse } from "next/server";
import { Agent, OpenAIProvider } from "@/sdk";
import { calculatorTool } from "@/examples/calculatorTool";
import { weatherTool } from "@/examples/weatherTool";
import { dateTimeTool } from "@/examples/dateTimeTool";
import { uuidTool } from "@/examples/uuidTool";
import { RealInputGuardrail } from "@/sdk/guardrails/RealInputGuardrail";
import { RealOutputGuardrail } from "@/sdk/guardrails/RealOutputGuardrail";
import { RealToolGuardrail } from "@/sdk/guardrails/RealToolGuardrail";

    const agent = new Agent({
      instructions: "You are a helpful AI assistant.",
      model: new OpenAIProvider(),
    });
    agent.addTool(weatherTool);
    agent.addTool(calculatorTool);
    agent.addTool(dateTimeTool);
    agent.addTool(uuidTool);
    agent.addToolGuardrail(new RealToolGuardrail());
    agent.addInputGuardrail(new RealInputGuardrail());
    agent.addOutputGuardrail(new RealOutputGuardrail());
    console.log(agent.getTools().length);
    agent.getEvents().on((event) => {
    console.log(`[EVENT] ${event.type}` , event);
});

    export async function POST(req: Request) {
         try {
            const { message, sessionId } = await req.json();
            console.log("Session ID:", sessionId);
            const result = await agent.run(message, sessionId );

         return NextResponse.json(result);
        } catch (err) {
        console.error(err);

        return NextResponse.json(
      { error: "Agent failed" },
      { status: 500 }
    );
  }
}