export interface Message {
  role: "user" | "assistant";
  content: string;
}

export class Session {
  private messages: Message[] = [];

  addMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }

  clear() {
    this.messages = [];
  }
}