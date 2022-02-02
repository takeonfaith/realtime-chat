import { createEffect, createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { getUserChats } from "../../../shared/api/chat-api";
import { Chat } from "../../../shared/api/model";
import { Message } from "../../../shared/api/model/message";

const useChats = () => {
  return {
    data: useStore($chatStore),
    loading: useStore(getChatsFx.pending),
  };
};

const getChatsFx = createEffect(async (userId: string): Promise<Chat[]> => {
  try {
    const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
    const { data } = await getUserChats(userId, token);

    return data;
  } catch (error) {
    throw new Error("Не удалось загрузить чаты");
  }
});

const changeSelectedChat = createEvent<{ chat: Chat }>();
const addSelectedMessages = createEvent<{ message: Message }>();
const clearAllselectedMessage = createEvent();
const replyToMessage = createEvent<{ message: Message }>();

interface ChatStore {
  chats: Chat[];
  selectedChat: Chat | null;
  selectedMessages: Message[];
  replyMessage: Message | null;
}

const initialStore: ChatStore = {
  chats: [],
  selectedChat: null,
  selectedMessages: [],
  replyMessage: null,
};

const $chatStore = createStore(initialStore)
  .on(getChatsFx.doneData, (oldData, newData) => ({
    ...oldData,
    chats: newData,
  }))
  .on(changeSelectedChat, (oldData, newData) => ({
    ...oldData,
    selectedChat: newData.chat,
  }))
  .on(addSelectedMessages, (oldData, newData) => ({
    ...oldData,
    selectedMessages: !!oldData.selectedMessages.find(
      (message) => message._id === newData.message._id
    )
      ? oldData.selectedMessages.filter(
          (message) => message._id !== newData.message._id
        )
      : [...oldData.selectedMessages, newData.message],
  }))
  .on(clearAllselectedMessage, (oldData, newData) => ({
    ...oldData,
    selectedMessages: [],
  }))
  .on(replyToMessage, (oldData, newData) => ({
    ...oldData,
    replyMessage:
      newData.message._id === oldData.replyMessage?._id
        ? null
        : newData.message,
  }));

export const selectors = {
  useChats,
};

export const effects = {
  getChatsFx,
};

export const events = {
  changeSelectedChat,
  clearAllselectedMessage,
  addSelectedMessages,
  replyToMessage,
};
