import { NextResponse } from "next/server";
import { Agent, OpenAIProvider } from "@/sdk";
import { calculatorTool } from "@/examples/calculatorTool";
import { weatherTool } from "@/examples/weatherTool";
import { dateTimeTool } from "@/examples/dateTimeTool";
import { uuidTool } from "@/examples/uuidTool";
import { RealInputGuardrail } from "@/sdk/guardrails/RealInputGuardrail";
import { RealOutputGuardrail } from "@/sdk/guardrails/RealOutputGuardrail";
import { RealToolGuardrail } from "@/sdk/guardrails/RealToolGuardrail";
// for structed outout..
// import { z } from "zod";
import { mathHandoff } from "@/examples/MathHandoff";
import { weatherHandoff } from "@/examples/WeatherHandoff";
import { codingHandoff } from "@/examples/codingHandoff";
import { researchHandoff } from "@/examples/researchHandoff";

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
    agent.addHandoff(mathHandoff);
    agent.addHandoff(weatherHandoff);
    agent.addHandoff(codingHandoff);
    agent.addHandoff(researchHandoff);
    console.log(agent.getTools().length);
    agent.getEvents().on((event) => {
    console.log(`[EVENT] ${event.type}` , event);
});

    export async function POST(req: Request) {
         try {
            const { message, sessionId } = await req.json();
            console.log("Session ID:", sessionId);
          // for structured output demooo...
           
        //   agent.setStructuredOutput({
        //     schema: z.object({
        //         country: z.string(),
        //         capital: z.string(),
        //         population: z.number(),
        //     }),
        //       description: `
        //     Return JSON like:

        //     {
        //       "country": string,
        //       "capital": string,
        //       "population": number
        //     }
        //    `
        // });
            const result = await agent.run(message, sessionId );
            console.log("========== TRACES ==========");
            console.dir(agent.getTraceManager().getAll(), {
                depth: null,
            });
            console.log("============================");
         return NextResponse.json(result);
        } catch (err) {
        console.error(err);

        return NextResponse.json(
      { error: "Agent failed" },
      { status: 500 }
    );
  }
}