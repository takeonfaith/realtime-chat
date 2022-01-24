import normalizeString from "../lib/normalize-string";
import { $api } from "./config";
import { Chat } from "./model";
import { Message } from "./model/message";

export const getUserChats = (userId: string, token: string) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    user: { _id: userId },
  };

  return $api.get<Chat[]>("/api/chat/", config);
};

export const createGroupChat = (users: string[], name: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  return $api.post<Chat>(
    "/api/chat/group",
    { users: JSON.stringify(users), name },
    config
  );
};

export const createChat = (userId: string, otherUserId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    user: { _id: userId },
  };
  return $api.post<Chat>("/api/chat/", { userId: otherUserId }, config);
};

export const renameGroup = (chatId: string, chatName: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.put<Chat>("/api/chat/rename", { chatId, chatName }, config);
};

export const sendMessage = (content: string, chatId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.post<Message>("/api/message/", { content, chatId }, config);
};

export const fetchMessages = (chatId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.get(`/api/message/${chatId}`, config);
};

export const searchAllMessages = (value: string, userId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    user: { _id: userId },
  };

  console.log(config);

  return $api.get(`/api/message?query=${value}`, config);
};

export const searchChatMessages = (chatId: string, value: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  return $api.get(`/api/message/${chatId}/search?query=${value}`, config);
};

export const addToGroup = (chatId: string, userId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.put("/api/chat/groupadd", { chatId, userId }, config);
};

export const removeFromGroup = (chatId: string, userId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.put("/api/chat/groupremove", { chatId, userId }, config);
};

export const searchChats = (value: string, userId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    user: { _id: userId },
  };

  return $api.get<Chat[]>(`/api/chat/${normalizeString(value)}`, config);
};
