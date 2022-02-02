import React from "react";
import { FiCornerUpLeft, FiCornerUpRight, FiX } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { BiPin } from "react-icons/bi";
import styled from "styled-components";
import { chatModel } from "../../../../entities/chat";
import { contextMenuModel } from "../../../../entities/context-menu";
import { Message } from "../../../../shared/api/model/message";
import { Button, Divider } from "../../../../shared/ui/atoms";
import { useModal } from "../../../../widgets";
import ShareMessage from "../molecules/share-message";
import { chatApi } from "../../../../shared/api";

const MessageContextMenuWrapper = styled.div``;

interface Props {
  message: Message;
}

const MessageContextMenu = ({ message }: Props) => {
  const { open } = useModal();
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();

  const handlePinMessage = async () => {
    if (message._id) {
      try {
        const { data } = await chatApi.pinMessage(
          message.chat._id,
          message._id
        );
        chatModel.events.changeSelectedChat({ chat: data });
      } catch (error) {}
    }
  };

  return (
    <MessageContextMenuWrapper>
      <Button
        icon={<FiCornerUpRight />}
        text={"Ответить"}
        onClick={() => {
          chatModel.events.replyToMessage({ message });
          contextMenuModel.events.close();
        }}
        width="100%"
        align="left"
        background="transparent"
      />
      <Button
        icon={<HiOutlineCheckCircle />}
        text={"Выбрать"}
        onClick={() => {
          chatModel.events.addSelectedMessages({ message });
          contextMenuModel.events.close();
        }}
        width="100%"
        align="left"
        background="transparent"
      />
      <Button
        icon={<FiCornerUpLeft />}
        text={"Переслать"}
        onClick={() => open(<ShareMessage messages={[message]} />)}
        width="100%"
        align="left"
        background="transparent"
      />
      {!selectedChat?.pinnedMessages?.find((m) => m._id === message._id) ? (
        <Button
          icon={<BiPin />}
          text={"Закрепить"}
          onClick={handlePinMessage}
          width="100%"
          align="left"
          background="transparent"
        />
      ) : (
        <Button
          icon={<BiPin />}
          text={"Открепить"}
          onClick={() =>
            message._id && chatApi.pinMessage(message.chat._id, message._id)
          }
          width="100%"
          align="left"
          background="transparent"
        />
      )}
      <Divider />
      <Button
        icon={<FiX />}
        text={"Удалить"}
        onClick={() => null}
        width="100%"
        align="left"
        background="transparent"
      />
    </MessageContextMenuWrapper>
  );
};

export default MessageContextMenu;
