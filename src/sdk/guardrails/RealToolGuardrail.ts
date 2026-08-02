import { ToolGuardrail } from "./ToolGuardrail";

export class RealToolGuardrail implements ToolGuardrail {

    async check({
        tool,
        input,
    }: {
        tool: string;
        input: unknown;
    }) {

        // Weather validation
        if (
            tool === "getWeather")
        //     
        {
            if (
                typeof input !== "object" ||
                input === null ||
                !("location" in input)
            ) {
                return {
                allowed: false,
                reason: "Weather location is missing.",
                };
            }

            const location = String(
                (input as { location: string }).location
            ).trim();

            if (!location) {
                return {
                    allowed: false,
                    reason: "Weather location cannot be empty.",
                };
            }
        }

        return {
            allowed: true,
        };
    }
}