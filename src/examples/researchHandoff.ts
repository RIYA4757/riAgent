export const researchHandoff = {
    agentName: "Research Agent",

    canHandle(input: string) {
        const text = input.toLowerCase();

        return (
            text.includes("research") ||
            text.includes("explain") ||
            text.includes("history") ||
            text.includes("who is") ||
            text.includes("what is")
        );
    }
};