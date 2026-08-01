import { Session } from "./Session";

export class MemoryStore {
  private sessions = new Map<string, Session>();

  getSession(sessionId: string) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Session());
    }

    return this.sessions.get(sessionId)!;
  }
}