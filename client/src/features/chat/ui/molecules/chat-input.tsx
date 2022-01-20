import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { chatApi } from "../../../../shared/api";
import { Message } from "../../../../shared/api/model/message";
import { Button, Input, Loading } from "../../../../shared/ui/atoms";

const ChatInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: var(--schedule);
  padding: 5px 10px;
  /* box-shadow: 0 0 1px #00000039; */
  box-shadow: 3px -2px 3px #00000029;
  z-index: 2;

  input {
    background: var(--schedule);
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

  const send = async () => {
    if (message.length) {
      socket.emit("stop typing", chatId);

      try {
        setLoading(true);
        const { data } = await chatApi.sendMessage(message, chatId);
        setMessage("");
        socket.emit("new message", data);
        setMessages((prev: Message[]) => [...prev, data]);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log("Не удалось отправить сообщение");
      }
    }
  };

  const keyDownHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!socket) return;

    if (e.key === "Enter") {
      setTyping(false);
      send();
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

  return (
    <ChatInputWrapper onKeyDown={keyDownHandle}>
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