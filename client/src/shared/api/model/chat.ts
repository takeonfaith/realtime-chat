import { IUser } from ".";
import { Message } from "./message";

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: IUser[];
  latestMessage: Message;
  groupAdmin: IUser;
  pinnedMessages?: Message[];
  updatedAt: string;
}
