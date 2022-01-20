import { createEffect, createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { getUserChats } from "../../../shared/api/chat-api";
import { Chat } from "../../../shared/api/model";

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

interface ChatStore {
  chats: Chat[];
  selectedChat: Chat | null;
}

const initialStore: ChatStore = {
  chats: [],
  selectedChat: null,
};

const $chatStore = createStore(initialStore)
  .on(getChatsFx.doneData, (oldData, newData) => ({
    ...oldData,
    chats: newData,
  }))
  .on(changeSelectedChat, (oldData, newData) => ({
    ...oldData,
    selectedChat: newData.chat,
  }));

export const selectors = {
  useChats,
};

export const effects = {
  getChatsFx,
};

export const events = {
  changeSelectedChat,
};
