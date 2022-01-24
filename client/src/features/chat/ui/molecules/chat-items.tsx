import React from "react";
import styled from "styled-components";
import { notificationModel } from "../../../../entities/notifications";
import { Chat, User as IUser } from "../../../../shared/api/model";
import { Message } from "../../../../shared/api/model/message";
import useResize from "../../../../shared/lib/hooks/use-resize";
import { Divider, Title } from "../../../../shared/ui/atoms";
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
}

const ChatItems = ({ chats, loading = false, addMode = false }: Props) => {
  const { height } = useResize();
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();

  return (
    <ChatItemsWrapper height={height}>
      {!chats.chats.length &&
        !chats.messages.length &&
        !chats.users.length &&
        !loading && (
          <>
            <Title size={3}>Нет результатов</Title>
            <img
              src={
                "https://ouch-cdn2.icons8.com/6xR7hLv0Cu7cNZTYf-TWggmFVxX_Cr_54b2S_KF_SvE/rs:fit:912:912/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTU1/LzQ1MThiYWQ2LTM5/ZGUtNDdjMC04YmZi/LWIyYmIzODkzMzkz/Zi5zdmc.png"
              }
              alt="e"
              style={{ width: "120px" }}
            />
          </>
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
              _id={message.chat._id}
              chatName={message.chat.chatName}
              groupAdmin={message.chat.groupAdmin}
              isGroupChat={message.chat.isGroupChat}
              latestMessage={message}
              users={message.chat.users}
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
