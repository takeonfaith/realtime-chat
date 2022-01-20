import { Chat, User } from ".";

export interface Message {
  content?: string;
  createdAt: string;
  sender: User;
  chat: Chat;
}

export type Messages = Message[];
