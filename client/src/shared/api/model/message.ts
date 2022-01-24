import { Chat, User } from ".";

export interface Message {
  content?: string;
  createdAt: string;
  sender: User;
  chat: Chat;
  received: "pending" | "success" | "failure";
}

export type Messages = Message[];
