import React, { useState } from "react";
import styled from "styled-components";
import { ChatItems } from ".";
import { chatModel } from "../../../../entities/chat";
import { userModel } from "../../../../entities/user";
import { chatApi } from "../../../../shared/api";
import { Chat } from "../../../../shared/api/model";
import { Message } from "../../../../shared/api/model/message";
import { Input, SubmitButton, Title } from "../../../../shared/ui/atoms";
import { useModal } from "../../../../widgets";

const ShareMessageWrapper = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;

  & > * + * {
    margin-top: 10px;
  }
`;

interface Props {
  messages: Message[];
}

const ShareMessage = ({ messages }: Props) => {
  const [text, setText] = useState("");
  const { close } = useModal();
  const {
    data: { chats },
  } = chatModel.selectors.useChats();
  const [chosenChats, setChosenChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const {
    data: { user },
  } = userModel.selectors.useUser();

  const send = async () => {
    if (user) {
      //TODO: create an array of pending messages
      for (let i = 0; i < chosenChats.length; i++) {
        const chat = chosenChats[i];
        try {
          setLoading(true);
          // const newMessage: Message = {
          //   chat,
          //   sender: user,
          //   createdAt: new Date().toString(),
          //   content: text,
          //   received: "pending",
          //   forwardedMessages: messages,
          // };

          const { data } = await chatApi.sendMessage(
            text,
            chat._id,
            messages.map((message) => message._id ?? "")
          );
          chatModel.events.clearAllselectedMessage();
          // socket.emit("new message", data);
          chatModel.effects.getChatsFx(user?._id);
          close();
          setCompleted(true);
          setLoading(false);
        } catch (error) {
          setCompleted(false);
          setLoading(false);
          chatModel.events.clearAllselectedMessage();
        }
      }
    }
  };

  return (
    <ShareMessageWrapper>
      <Title size={3} align="left">
        Переслать сообщение
      </Title>
      <ChatItems
        chats={{
          chats: chats,
          users: [],
          messages: [],
        }}
        loading={false}
        chosenChats={chosenChats}
        setChosenChats={setChosenChats}
      />
      <Input
        value={text}
        setValue={setText}
        placeholder="Введите сообщение..."
      />
      <SubmitButton
        text={"Отправить"}
        action={send}
        isLoading={loading}
        completed={completed}
        setCompleted={setCompleted}
        isActive={!!chosenChats.length}
      />
    </ShareMessageWrapper>
  );
};

export default ShareMessage;
