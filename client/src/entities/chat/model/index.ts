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

interface ChatStore {
  chats: Chat[];
  selectedChat: Chat | null;
  selectedMessages: Message[];
}

const initialStore: ChatStore = {
  chats: [],
  selectedChat: null,
  selectedMessages: [],
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
};
