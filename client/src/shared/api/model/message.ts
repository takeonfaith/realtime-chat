import { Chat, User } from ".";

export interface Message {
  _id?: string;
  content?: string;
  createdAt: string;
  sender: User;
  chat: Chat;
  received: "pending" | "success" | "failure";
  forwardedMessages: Message[];
}

export type Messages = Message[];
