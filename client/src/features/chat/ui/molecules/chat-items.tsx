import React from "react";
import styled from "styled-components";
import { notificationModel } from "../../../../entities/notifications";
import { Chat, User as IUser } from "../../../../shared/api/model";
import useResize from "../../../../shared/lib/hooks/use-resize";
import { Divider, Title } from "../../../../shared/ui/atoms";
import { User } from "../../../../widgets";
import { ChatItem, SkeletonLoading } from "../atoms";

const ChatItemsWrapper = styled.div<{ height: number }>`
  overflow-y: auto;
  max-height: ${({ height }) => height - 260 + "px"};
`;

interface Props {
  chats: { chats: Chat[]; users: IUser[] };
  loading: boolean;
  addMode?: boolean;
}

const ChatItems = ({ chats, loading = false, addMode = false }: Props) => {
  const { height } = useResize();
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();

  return (
    <ChatItemsWrapper height={height}>
      {!chats.chats.length && !chats.users.length && !loading && (
        <Title size={3}>Нет чатов</Title>
      )}
      {loading && chats.chats.length === 0 && (
        <>
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
        </>
      )}
      {chats.chats.map((chat) => (
        <ChatItem
          {...chat}
          key={chat._id}
          loading={false}
          amountOfUnreadMessages={
            notifications.filter(
              (notification) => notification.chat._id === chat._id
            ).length
          }
          addMode={addMode}
        />
      ))}
      {!!chats.users.length && !!chats.chats.length && <Divider />}
      {chats.users.map((user) => (
        <User {...user} status="online" key={user._id} />
      ))}
    </ChatItemsWrapper>
  );
};

export default ChatItems;
