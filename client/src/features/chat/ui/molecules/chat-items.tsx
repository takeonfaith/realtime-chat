import React from "react";
import styled from "styled-components";
import { notificationModel } from "../../../../entities/notifications";
import { Chat, IUser } from "../../../../shared/api/model";
import { Message } from "../../../../shared/api/model/message";
import useResize from "../../../../shared/lib/hooks/use-resize";
import { Divider, NoResult, Title } from "../../../../shared/ui/atoms";
import { User } from "../../../../widgets";
import { ChatItem, SkeletonLoading } from "../atoms";

const ChatItemsWrapper = styled.div<{ height: number }>`
  overflow-y: auto;
  max-height: ${({ height }) => height - 260 + "px"};
`;

interface Props {
  chats: { chats: Chat[]; users: IUser[]; messages: Message[] };
  loading: boolean;
  addMode?: boolean;
  chosenChats?: Chat[];
  setChosenChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const ChatItems = ({
  chats,
  chosenChats,
  setChosenChats,
  loading = false,
  addMode = false,
}: Props) => {
  const { height } = useResize();
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();

  return (
    <ChatItemsWrapper height={height}>
      <NoResult
        show={
          !chats.chats.length &&
          !chats.messages.length &&
          !chats.users.length &&
          !loading
        }
      />
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
          latestMessage={chat.latestMessage}
          chat={chat}
          key={chat._id}
          loading={false}
          amountOfUnreadMessages={
            notifications.filter(
              (notification) => notification.chat._id === chat._id
            ).length
          }
          addMode={addMode}
          chosenChats={chosenChats}
          setChosenChats={setChosenChats}
        />
      ))}

      {!!chats.users.length && (
        <>
          {!!chats.chats.length && <Divider />}
          <Title size={5} align="left" bottomGap>
            Пользователи
          </Title>
          {chats.users.map((user) => (
            <User {...user} status="online" key={user._id} />
          ))}
        </>
      )}

      {!!chats.messages.length && (
        <>
          {(!!chats.users.length || !!chats.chats.length) && <Divider />}
          <Title size={5} align="left" bottomGap>
            Сообщения
          </Title>
          {chats.messages.map((message) => (
            <ChatItem
              latestMessage={message}
              chat={message.chat}
              key={message.createdAt}
              loading={false}
              amountOfUnreadMessages={0}
              addMode={addMode}
            />
          ))}
        </>
      )}
    </ChatItemsWrapper>
  );
};

export default ChatItems;
