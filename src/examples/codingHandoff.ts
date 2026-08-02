export const codingHandoff = {
    agentName: "Coding Agent",

    canHandle(input: string) {
        const text = input.toLowerCase();

        return (
            text.includes("code") ||
            text.includes("javascript") ||
            text.includes("typescript") ||
            text.includes("python") ||
            text.includes("java") ||
            text.includes("React") ||
            text.includes("c") ||
            text.includes("c++") ||
            text.includes("node js") ||
            text.includes("next.js") ||
            text.includes("bug") ||
            text.includes("algorithm") ||
            text.includes("linked list") ||
            text.includes("binary tree") ||
            text.includes("array") ||
            text.includes("leetcode") ||
            text.includes("bug")
        );
    }
};