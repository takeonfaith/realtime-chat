import { Chat, IUser } from ".";

export interface Message {
  _id?: string;
  content?: string;
  createdAt: string;
  sender: IUser;
  chat: Chat;
  received: "pending" | "success" | "failure";
  forwardedMessages: Message[];
}

export type Messages = Message[];
