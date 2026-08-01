import { Tool } from "./Tool";

export class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool) {
    this.tools.set(tool.name, tool);
  }
  unregister(name: string) {
    this.tools.delete(name);
  }

  has(name: string) {
    return this.tools.has(name);
  }

  getTools() {
    // return this.tools;
    return Array.from(this.tools.values());
  }
  getTool(name: string) {
    // return this.tools.find((tool) => tool.name === name);
    return this.tools.get(name);
  }
  clear() {
    this.tools.clear();
  }

  size() {
    return this.tools.size;
  }
}