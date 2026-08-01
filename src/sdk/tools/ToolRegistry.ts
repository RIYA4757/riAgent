import { Tool } from "./Tool";

export class ToolRegistry {
  private tools: Tool[] = [];

  register(tool: Tool) {
    this.tools.push(tool);
  }

  getTools() {
    return this.tools;
  }
}