import { Agent } from "../agent/Agent";

export class AgentRunner {
  async run(agent: Agent, userInput: string) {
    return agent.execute(userInput);
  }
}