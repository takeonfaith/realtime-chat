import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { PinUser } from ".";
import { chatModel } from "../../../../entities/chat";
import { userModel } from "../../../../entities/user";
import { chatApi } from "../../../../shared/api";
import { Message } from "../../../../shared/api/model/message";
import limitNumber from "../../../../shared/lib/limit-number";
import { Button, Input, Loading } from "../../../../shared/ui/atoms";

const ChatInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: var(--list-of-chats);
  padding: 5px 10px;
  z-index: 2;
  position: relative;

  input {
    background: transparent;
  }
`;

interface Props {
  chatId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const ChatInput = ({ chatId, setMessages, socket }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();
  const [showPinUser, setShowPinUser] = useState(false);
  const chatUsers = selectedChat?.users?.filter((u) => u._id !== user?._id);
  const [chosenPinUser, setChosenPinUser] = useState(0);

  const handleChosePinUser = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showPinUser) {
      if (e.key === "ArrowDown") {
        setChosenPinUser((prev) =>
          limitNumber(prev + 1, (chatUsers?.length ?? 0) - 1)
        );
      } else if (e.key === "ArrowUp") {
        setChosenPinUser((prev) =>
          limitNumber(prev - 1, (chatUsers?.length ?? 0) - 1)
        );
      }
    }
  };

  const send = async () => {
    if (message.length && user && selectedChat && !showPinUser) {
      socket.emit("stop typing", chatId);

      try {
        setLoading(true);
        const newMessage: Message = {
          chat: selectedChat,
          sender: user,
          createdAt: new Date().toString(),
          content: message,
          received: "pending",
        };
        setMessage("");
        setMessages((prev: Message[]) => [...prev, newMessage]);
        const { data } = await chatApi.sendMessage(message, chatId);
        socket.emit("new message", data);
        setMessages((messages: Message[]) => {
          messages[messages.length - 1].received = "success";
          return [...messages];
        });
        chatModel.effects.getChatsFx(user?._id);

        setLoading(false);
      } catch (error) {
        setMessages((messages: Message[]) => {
          messages[messages.length - 1].received = "failure";
          return [...messages];
        });
        setLoading(false);
      }
    }
  };

  const keyDownHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!socket) return;

    handleChosePinUser(e);

    if (e.key === "Enter") {
      if (showPinUser) {
        setShowPinUser(false);
        setMessage((prev) => prev + chatUsers?.[chosenPinUser].login);
      } else {
        setTyping(false);
        send();
      }
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatId);
    }

    let lastTypingTime = new Date().getTime();

    const timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    const messages = message.split("@");
    messages.shift();

    if (
      !!message.length &&
      !(messages.find((el) => el.length === 0) ?? true) &&
      selectedChat?.isGroupChat
    )
      setShowPinUser(true);
    else setShowPinUser(false);
  }, [message]);

  return (
    <ChatInputWrapper onKeyDown={keyDownHandle}>
      <PinUser
        show={showPinUser ?? false}
        users={chatUsers ?? []}
        chosenUser={chosenPinUser}
      />
      <Button
        icon={<ImAttachment />}
        onClick={() => null}
        background="transparent"
      />
      <Input
        value={message}
        setValue={setMessage}
        placeholder="Введите сообщение..."
      />
      <Button
        icon={loading ? <Loading width="15px" /> : <IoMdSend />}
        onClick={send}
        background="transparent"
      />
    </ChatInputWrapper>
  );
};

export default ChatInput;
