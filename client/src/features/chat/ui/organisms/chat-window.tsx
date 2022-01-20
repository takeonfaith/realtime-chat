import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import { notificationModel } from "../../../../entities/notifications";
import { userModel } from "../../../../entities/user";
import { chatApi } from "../../../../shared/api";
import { API_BASE_URL } from "../../../../shared/api/config";
import { Message } from "../../../../shared/api/model/message";
import { ChatHeader, Messages } from "../molecules";
import ChatInput from "../molecules/chat-input";

const ChatWindowWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  & > img {
    position: absolute;
    width: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.4;
  }
`;

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let selectedChat: string | undefined;

const ChatWindow = () => {
  const params = useRouteMatch(`${CHAT_ROUTE}/:chatId`)?.params as {
    chatId: string | undefined;
  };
  const {
    data: { user },
  } = userModel.selectors.useUser();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();

  const fetch = async () => {
    if (params.chatId) {
      try {
        setLoading(true);
        const { data } = await chatApi.fetchMessages(params.chatId);

        setLoading(false);
        setMessages(data);
        socket.emit("join chat", params.chatId);
      } catch (error) {
        setLoading(false);
        console.log("Не удалось загрузить сообщения");
      }
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket = io(API_BASE_URL);
      console.log("user connection");

      console.log(socket);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      return () => {
        socket.emit("disconnect");

        socket.off();
      };
    }
  }, [user?._id]);

  useEffect(() => {
    if (socket && user) {
      socket.on("message received", (newMessage: Message) => {
        chatModel.effects.getChatsFx(user?._id);

        if (!selectedChat || selectedChat !== newMessage.chat._id) {
          console.log(notifications.includes(newMessage));

          if (!notifications.includes(newMessage)) {
            notificationModel.events.pushNotification({ message: newMessage });
            console.log(newMessage);
          }
        } else {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }
  }, []);

  useEffect(() => {
    fetch();

    selectedChat = params?.chatId;
  }, [params?.chatId]);

  return (
    <ChatWindowWrapper>
      <ChatHeader />
      <Messages loading={loading} messages={messages} isTyping={isTyping} />
      <ChatInput
        chatId={params?.chatId ?? ""}
        setMessages={setMessages}
        socket={socket}
      />
    </ChatWindowWrapper>
  );
};

export default ChatWindow;
