# RiAgent SDK

A lightweight, extensible TypeScript SDK for building AI agents.

**Repository:** https://github.com/RIYA4757/riAgent

**Author:** Riya Paul

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![OpenAI](https://img.shields.io/badge/OpenAI-Supported-success)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Table of Contents

- Overview
- Features
- Architecture
- Installation
- Quick Start
- Agent Runtime
- Tools
- Agent Capabilities
- Memory & Sessions
- Handoffs
- Guardrails
- Structured Output
- Streaming & Events
- Tracing & Reliability
- Model Providers
- Folder Structure
- Examples
- Roadmap
- License

---
## Live Demo

**Application:** https://ri-agent.vercel.app/

The live deployment demonstrates:

- Agent Runtime
- Tool Calling
- Multi-Agent Handoffs
- Memory & Sessions
- Guardrails
- Structured Output
---


# Overview

RiAgent SDK is a modular TypeScript SDK for building AI-powered agents capable of reasoning, invoking tools, maintaining conversation history, delegating work to specialized agents, validating inputs and outputs, and producing structured responses.

The project demonstrates how an agent runtime can be implemented from scratch without relying on existing agent frameworks.

The SDK separates different concerns into reusable modules including:

- Agent Runtime
- Tool Registry
- Memory
- Sessions
- Guardrails
- Handoffs
- Structured Output
- Event System
- Tracing
- Model Provider Abstraction

The goal is to provide an SDK that developers can extend with their own tools, models, and workflows while keeping the runtime independent of any specific LLM provider.

---
## Why RiAgent SDK?

RiAgent SDK is designed to provide a modular and extensible foundation for building AI-powered applications. Unlike simple chatbot wrappers, the SDK supports:

- Modular Agent Runtime
- Tool Calling
- Multi-Agent Handoffs
- Memory & Session Management
- Guardrails
- Structured Output Validation
- Runtime Events
- Execution Tracing
- Provider Abstraction

This architecture enables developers to build production-ready AI workflows while keeping the runtime independent from any specific language model provider.

# Features

## Agent Runtime

- Multi-step agent execution loop
- Automatic tool detection
- Tool execution
- Tool result reasoning
- Maximum iteration protection

## Tools

- Tool registration
- Input validation
- Async execution
- Typed schemas
- Error handling

## Memory

- Multi-turn conversations
- Session management
- Conversation history

## Guardrails

- Input Guardrails
- Output Guardrails
- Tool Guardrails

## Handoffs

- Task delegation between agents
- Specialized agents
- Loop prevention

## Structured Output

- Zod-based schema validation
- Developer-defined response schemas
- Runtime validation

## Events

- Agent lifecycle events
- Tool events
- Guardrail events

## Tracing

- Run ID
- Agent Name
- Event Timeline
- Execution Tracking

## Model Provider Abstraction

Current implementation:

- OpenAI Provider

Architecture allows additional providers to be added without modifying the agent runtime.

---

# Architecture

```

                 User Request
                       │
                       ▼
                  Agent Runtime
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Guardrails    Memory      Handoffs
          │            │            │
          ▼            ▼            ▼
      Tool Registry  Sessions   Other Agents
          │
          ▼
       Model Provider
          │
          ▼
         OpenAI

```

The runtime coordinates every component while keeping each module independent and reusable.

---

# Installation

Clone the repository

```bash
git clone <git clone https://github.com/RIYA4757/riagent-sdk.git>
cd riagent-sdk
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
OPENAI_API_KEY=your_openai_api_key
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```
# Quick Start

The following example demonstrates how to create an agent, register tools, configure guardrails, and execute the agent.

```typescript
import { Agent, OpenAIProvider } from "@/sdk";
import { weatherTool } from "@/examples/weatherTool";
import { calculatorTool } from "@/examples/calculatorTool";

const agent = new Agent({
    instructions: "You are a helpful AI assistant.",
    model: new OpenAIProvider(),
});

agent.addTool(weatherTool);
agent.addTool(calculatorTool);

const result = await agent.run(
    "What's the weather in Kolkata?"
);

console.log(result.output);
```

The SDK automatically:

- Builds the prompt
- Detects tool calls
- Executes tools
- Sends tool results back to the model
- Continues reasoning until a final answer is produced

---

# Agent Runtime

The Agent Runtime is the core component of RiAgent SDK. It manages the complete execution lifecycle of every user request.

## Runtime Workflow

```
User Input
     │
     ▼
Input Guardrails
     │
     ▼
Build Prompt
     │
     ▼
LLM
     │
     ▼
Tool Call?
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ▼        ▼
Execute   Final Answer
Tool
 │
 ▼
Append Tool Result
 │
 ▼
LLM
 │
 ▼
Repeat Until Finished
```

The runtime performs the following operations:

- Accepts user input
- Loads conversation history
- Applies input guardrails
- Builds the system prompt
- Sends instructions to the language model
- Detects tool requests
- Validates tool inputs
- Executes tools
- Sends tool outputs back to the model
- Continues the reasoning loop
- Applies output validation
- Stores the final response in memory
- Emits runtime events
- Records traces

To prevent infinite reasoning loops, the runtime limits the maximum number of tool iterations.

---

## Prompt Construction

The runtime dynamically builds prompts using:

- Agent instructions
- Conversation history
- Available tool descriptions
- Tool execution history
- Current user request

This allows the model to reason across multiple steps while maintaining conversation context.

---

## Tool Execution Loop

When the language model decides that a tool is required, it returns structured JSON similar to:

```json
{
    "action": "tool",
    "tool": "getWeather",
    "input": {
        "location": "Kolkata"
    }
}
```

The runtime then:

1. Finds the requested tool
2. Validates its input
3. Executes the tool
4. Stores the output
5. Sends the output back to the model
6. Waits for the next instruction

The process repeats until the model returns a final response.

---

# Tools

Tools allow the language model to perform actions outside of normal text generation.

Each tool consists of:

- Name
- Description
- Input Schema
- Execution Function

Example structure:

```typescript
{
    name: "...",
    description: "...",
    schema: z.object({...}),
    execute: async (...) => { ... }
}
```

The SDK validates tool inputs before execution to prevent invalid requests.

---

## Tool Registration

Register tools using:

```typescript
agent.addTool(weatherTool);
agent.addTool(calculatorTool);
agent.addTool(dateTimeTool);
agent.addTool(uuidTool);
```

Internally, tools are stored inside the Tool Registry, allowing the runtime to discover and execute them dynamically.

---

## Input Validation

Every tool uses a Zod schema for validation.

Example:

```typescript
schema: z.object({
    location: z.string()
})
```

Before execution, the SDK validates the incoming arguments.

If validation fails, the runtime returns a meaningful error instead of executing the tool.

---

## Asynchronous Execution

All tools support asynchronous execution.

```typescript
async execute(input) {
    ...
}
```

This allows tools to:

- Call APIs
- Query databases
- Read files
- Perform network requests
- Execute long-running operations

without blocking the runtime.

---

## Error Handling

Each tool execution is wrapped in a try-catch block.

If a tool throws an exception, the SDK safely reports the failure to the caller instead of crashing the application.

Example error message:

```
Tool "weather" failed:
Invalid location provided.
```

---

## Included Example Tools

The project contains several example tools demonstrating different capabilities.

### Weather Tool

Returns current weather information for a specified location.

Example:

```
User:
What's the weather in Kolkata?

Tool Output:

{
    city: "Kolkata",
    temperature: "29°C",
    condition: "Sunny"
}
```

---

### Calculator Tool

Performs mathematical calculations.

Example:

```
User:
Calculate 45 × 18
```

---

### Date & Time Tool

Returns the current system date and time.

Example:

```
User:
What time is it?
```

---

### UUID Tool

Generates a random UUID.

Example:

```
User:
Generate a UUID
```

---

The SDK architecture allows developers to create and register additional tools without modifying the runtime.

# Agent Capabilities

RiAgent SDK provides several built-in capabilities that enable developers to build intelligent, extensible, and safe AI agents. These capabilities are modular and can be combined based on the application's requirements.

---

## Memory & Sessions

The SDK supports multi-turn conversations through an in-memory session management system.

Each session maintains its own conversation history, allowing the agent to preserve context across multiple user interactions.

### Features

- In-memory session storage
- Conversation history tracking
- Session isolation
- Persistent runtime state during execution

Example:

```typescript
const result = await agent.run(
    "What's the weather today?",
    "session-123"
);

await agent.run(
    "What about tomorrow?",
    "session-123"
);
```

Both requests share the same conversation history because they use the same session identifier.

The SDK separates:

- Agent configuration
- Current execution state
- Persistent session memory

making the runtime easier to maintain and extend.

---

# Guardrails

Guardrails provide validation before and after model execution to improve safety and reliability.

RiAgent SDK currently supports three guardrail types.

## Input Guardrails

Executed before the prompt is sent to the language model.

Use cases include:

- Rejecting empty prompts
- Blocking unsafe requests
- Preventing invalid inputs

Example:

```typescript
agent.addInputGuardrail(
    new RealInputGuardrail()
);
```

---

## Output Guardrails

Executed after the language model generates its response.

Use cases include:

- Blocking unsafe outputs
- Removing sensitive content
- Validating generated responses

Example:

```typescript
agent.addOutputGuardrail(
    new RealOutputGuardrail()
);
```

---

## Tool Guardrails

Executed before a tool is invoked.

These guardrails validate tool inputs and prevent invalid tool execution.

Example:

```typescript
agent.addToolGuardrail(
    new RealToolGuardrail()
);
```

Example validation:

- Reject empty weather locations
- Prevent invalid calculator input
- Block unsupported tool arguments

---

# Handoffs

RiAgent SDK supports agent delegation through handoffs.

Instead of handling every request with a single agent, tasks can be transferred to specialized agents.

Current examples include:

- Math Agent
- Weather Agent
- Coding Agent
- Research Agent

Example:

```typescript
agent.addHandoff(mathHandoff);
agent.addHandoff(weatherHandoff);
agent.addHandoff(codingHandoff);
agent.addHandoff(researchHandoff);
```

The runtime evaluates whether a request should be delegated to another agent.

Example:

```
User:
Reverse a linked list.
```

↓

```
Main Agent
```

↓

```
Coding Agent
```

↓

```
Final Response
```

### Handoff Features

- Context preservation
- Agent identification
- Event emission
- Trace recording
- Loop prevention

---

# Structured Output

RiAgent SDK supports schema-based structured responses using Zod.

Developers can define the expected output schema and validate model responses at runtime.

Example:

```typescript
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
`
});
```

The runtime automatically:

- Appends schema instructions to the prompt
- Validates the generated output
- Returns validation errors if the schema does not match

Example Output

```json
{
    "country": "India",
    "capital": "New Delhi",
    "population": 1400000000
}
```

This feature enables developers to build applications requiring structured data rather than free-form text.

---

# Model Provider Abstraction

The SDK uses a ModelProvider interface to decouple the agent runtime from any specific LLM provider.

Implemented:

✅ OpenAIProvider

Example provider implementations:

ClaudeProvider
GeminiProvider

These demonstrate how additional providers can be integrated by implementing the same interface.

# Streaming & Events

RiAgent SDK includes an event-driven architecture that allows developers to observe and react to different stages of the agent execution lifecycle.

Although the current playground primarily uses synchronous responses, the SDK has been designed with streaming support in mind through the `generateStream()` method defined in the `ModelProvider` interface.

## Current Event Types

The runtime emits several events during execution.

Examples include:

- `agent.started`
- `agent.finished`
- `tool.selected`
- `tool.executed`
- `guardrail.input.passed`
- `guardrail.input.blocked`
- `guardrail.output.passed`
- `guardrail.output.blocked`

Developers can subscribe to these events using the built-in event emitter.

Example:

```typescript
agent.getEvents().on((event) => {
    console.log(event);
});
```

Example output:

```
[EVENT] agent.started
[EVENT] tool.selected
[EVENT] tool.executed
[EVENT] guardrail.output.passed
[EVENT] agent.finished
```

The event system improves observability and enables developers to build custom logging, monitoring, or analytics solutions.

---

## Streaming

The SDK exposes a streaming-capable provider interface.

```typescript
generateStream(prompt)
```

The current implementation includes support within the OpenAI provider.

This architecture allows future runtime updates to stream partial model responses while preserving the existing agent workflow.

---

# Tracing & Reliability

RiAgent SDK records execution traces to help developers inspect and debug agent behavior.

Each run is assigned a unique Run ID.

A trace contains information such as:

- Run ID
- Agent Name
- Start Time
- End Time
- Runtime Events

Example trace:

```text
Run ID
│
├── Agent Started
├── Tool Selected
├── Tool Executed
├── Guardrail Passed
└── Agent Finished
```

Traces are stored by the `TraceManager` and can be inspected after execution.

Example:

```typescript
agent.getTraceManager().getAll();
```

Tracing provides visibility into the execution flow without modifying the runtime logic.

---

## Reliability

The runtime includes several safeguards to improve reliability.

### Maximum Iteration Protection

The runtime limits repeated tool execution to prevent infinite loops.

### Input Validation

Every tool input is validated using Zod before execution.

### Exception Handling

Tool execution is wrapped in `try-catch` blocks to prevent unexpected failures from crashing the application.

### Guardrails

Validation is performed before and after model execution to improve runtime safety.

---

# Error Handling

RiAgent SDK includes built-in error handling mechanisms to ensure reliable execution.

## Tool Execution Errors

All tool executions are wrapped in `try-catch` blocks. If a tool throws an exception, the SDK returns a meaningful error instead of terminating the agent execution.

## Input Validation Errors

Tool inputs are validated using Zod schemas before execution. Invalid inputs produce descriptive validation errors.

## Structured Output Validation

When Structured Output is enabled, responses are validated against the developer-defined schema. Invalid outputs result in validation errors.

## Runtime Safety

The agent runtime includes maximum iteration protection to prevent infinite reasoning loops during tool execution.
---

# Project Structure

```
riagent-sdk/
│
├── src/
│   ├── sdk/
│   │   ├── agent/
│   │   ├── runtime/
│   │   ├── tools/
│   │   ├── memory/
│   │   ├── guardrails/
│   │   ├── handoffs/
│   │   ├── events/
│   │   ├── tracing/
│   │   ├── providers/
│   │   └── types/
│   │
│   ├── app/
│   └── examples/
│
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

---

# Examples

The repository contains several examples demonstrating different SDK capabilities.

| Example | Description |
|----------|-------------|
| Weather Tool | Retrieve weather information |
| Calculator Tool | Perform mathematical calculations |
| Date & Time Tool | Return current date and time |
| UUID Tool | Generate random UUIDs |
| Structured Output Demo | Validate model responses using Zod |
| Math Handoff | Delegate mathematical queries |
| Weather Handoff | Delegate weather-related queries |
| Coding Handoff | Delegate programming questions |
| Research Handoff | Delegate research tasks |

---

# Future Improvements

Potential future enhancements include:

- Full runtime streaming support
- Additional model providers (Claude, Gemini, Groq)
- Persistent memory adapters (Redis, SQLite)
- Retry strategies for failed model calls
- Token usage tracking
- Cost estimation
- Tool execution timeout configuration
- Plugin system for custom extensions

---

# Technologies Used

- TypeScript
- Next.js
- OpenAI SDK
- Zod
- React

---

# Assignment Coverage

| Requirement | Status |
|-------------|--------|
| Agent Runtime | ✅ |
| Tools | ✅ |
| Agent Capabilities | ✅ |
| Memory & Sessions | ✅ |
| Handoffs | ✅ |
| Guardrails | ✅ |
| Structured Output | ✅ |
| Streaming & Events | ✅ *(Event system implemented, streaming provider architecture included)* |
| Tracing & Reliability | ✅ |
| Model Provider Abstraction | ✅ |

---

# Contributing

Contributions and improvements are welcome.

Feel free to fork the repository, create new tools, implement additional model providers, or extend the runtime with new capabilities.

---

# License

This project is licensed under the MIT License.

---
# Author

**Riya Paul**

Software Developer | AI & GenAI Enthusiast

GitHub: https://github.com/RIYA4757

Repository: https://github.com/RIYA4757/riagent-sdk

This project was developed as part of an AI Agent SDK assignment to demonstrate the implementation of a modular AI agent framework from scratch using **TypeScript**, **Next.js**, **OpenAI**, and **Zod**.

The SDK includes:

- Agent Runtime
- Tool Registry
- Memory & Sessions
- Guardrails
- Multi-Agent Handoffs
- Structured Output
- Event System
- Tracing
- Model Provider Abstraction

If you find this project helpful, feel free to explore the repository or contribute with suggestions and improvements.

