import React from "react";
import { FiCornerUpLeft, FiCornerUpRight, FiX } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi";
import styled from "styled-components";
import { chatModel } from "../../../../entities/chat";
import { contextMenuModel } from "../../../../entities/context-menu";
import { Message } from "../../../../shared/api/model/message";
import { Button, Divider } from "../../../../shared/ui/atoms";
import { useModal } from "../../../../widgets";
import ShareMessage from "../molecules/share-message";

const MessageContextMenuWrapper = styled.div``;

interface Props {
  message: Message;
}

const MessageContextMenu = ({ message }: Props) => {
  const { open } = useModal();

  return (
    <MessageContextMenuWrapper>
      <Button
        icon={<FiCornerUpRight />}
        text={"Ответить"}
        onClick={() => null}
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
