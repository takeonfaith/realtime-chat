import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { SkeletonLoading } from ".";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import { userModel } from "../../../../entities/user";
import { Chat, Message } from "../../../../shared/api/model";
import { Colors } from "../../../../shared/consts";
import localizeDate from "../../../../shared/lib/localize-date";
import { Checkbox } from "../../../../shared/ui/atoms";
import { Avatar } from "../../../../shared/ui/molecules";
import getChatName from "../../lib/get-chat-name";

const ChatItemWrapper = styled(Link)<{ isChosen: boolean }>`
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;

  .chosen-chat-checkbox {
    position: absolute;
    top: 28px;
    left: 30px;
    z-index: 2;
  }

  .chat-item-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: ${({ isChosen }) => (isChosen ? "#fff" : "var(--text)")};
    width: 100%;
    padding: 10px;
    border-radius: var(--brLight);
    background: ${({ isChosen }) =>
      isChosen ? "#5275fa" : "var(--list-of-chats)"};
    overflow: hidden;
    position: relative;

    &:hover {
      filter: brightness(0.95);
    }

    .amount-of-unread-messages {
      position: absolute;
      top: 10px;
      left: 47px;
      min-width: 20px;
      height: 20px;
      background: ${Colors.red.main};
      border-radius: 100%;
      color: #fff;
      border: 3px solid var(--theme);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6em;
      font-weight: bold;
    }

    .name-and-message {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;

      & > b {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.8em;
      }

      .last-message {
        width: 100%;
        font-size: 0.8em;
        opacity: 0.7;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 200px;

        .forwarded-message {
          color: ${({ isChosen }) =>
            !isChosen ? "var(--reallyBlue)" : "#fff"};
        }
      }
    }

    .sent-time {
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      font-size: 0.8em;
      opacity: 0.6;
      font-weight: 500;
    }
  }
`;

type Props = { chat?: Chat; latestMessage: Message } & {
  loading: boolean;
  amountOfUnreadMessages: number;
  avatar?: string;
  addMode: boolean;
  chosenChats?: Chat[];
  setChosenChats?: React.Dispatch<React.SetStateAction<Chat[]>>;
};

const ChatItem = ({
  chat,
  latestMessage,
  loading,
  amountOfUnreadMessages,
  avatar,
  addMode,
  chosenChats,
  setChosenChats,
}: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const params = useRouteMatch(`${CHAT_ROUTE}/:chatId`)?.params as {
    chatId: string | undefined;
  };

  if (!user || !chat) return null;
  const { _id, chatName, isGroupChat, users } = chat;

  const handleCheck = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!!chosenChats && setChosenChats) {
      if (!!chosenChats.find((chat) => chat._id === _id)) {
        setChosenChats((prev) => prev.filter((chat) => chat._id !== _id));
      } else {
        setChosenChats((prev) => [...prev, chat]);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!chosenChats) {
      chatModel.events.changeSelectedChat({
        chat,
      });
    } else {
      e.preventDefault();
      handleCheck(e as any);
    }
  };

  return !loading ? (
    <ChatItemWrapper
      to={`${CHAT_ROUTE}/${_id}`}
      onClick={handleClick}
      isChosen={params?.chatId === _id && !chosenChats}
    >
      {!!chosenChats && (
        <div className="chosen-chat-checkbox">
          <Checkbox
            checked={!!chosenChats.find((chat) => chat._id === _id)}
            setChecked={handleCheck}
            invisibleOnFalse
          />
        </div>
      )}
      <div className="chat-item-content">
        {amountOfUnreadMessages !== 0 && (
          <div className="amount-of-unread-messages">
            {amountOfUnreadMessages}
          </div>
        )}
        <Avatar
          avatar={avatar}
          width="45px"
          height="45px"
          marginRight="7px"
          type={chat.isGroupChat ? "chat" : "user"}
          background={
            params?.chatId === _id && !chosenChats ? "#ffffffab" : undefined
          }
        />
        <div className="name-and-message">
          <b>{isGroupChat ? chatName : getChatName(user?._id, users)}</b>
          {latestMessage && (
            <div className="last-message">
              {latestMessage.content}
              <span className="forwarded-message">
                {!!latestMessage?.forwardedMessages?.length &&
                  " Пересланное сообщение"}
              </span>
            </div>
          )}
        </div>
        {latestMessage && (
          <div className="sent-time">
            {localizeDate(latestMessage.createdAt, "hours")}
          </div>
        )}
      </div>
    </ChatItemWrapper>
  ) : (
    <SkeletonLoading />
  );
};

export default ChatItem;
