import React from "react";
import styled from "styled-components";
import { ForwardedMessage, MessageContextMenu } from ".";
import { chatModel } from "../../../../entities/chat";
import { contextMenuModel } from "../../../../entities/context-menu";
import { userModel } from "../../../../entities/user";
import { Message } from "../../../../shared/api/model/message";
import localizeDate from "../../../../shared/lib/localize-date";
import getMessageReceivedIcon from "../../lib/get-message-received-icon";
import prepareContent from "../../lib/prepare-content";

const MessageItemWrapper = styled.div<{
  isYourMessage: boolean;
  isLast: boolean;
  isSelected: boolean;
}>`
  display: flex;
  align-items: flex-end;
  padding: ${({ isLast }) => (!isLast ? "2px 0" : "2px 0 10px 0")};
  position: relative;

  .message-avatar {
    width: 32px;
    height: 32px;

    position: sticky;
    bottom: 0px;
    top: 0px;
  }

  &::before {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: -50px;
    background: ${({ isSelected }) => isSelected && "#7272f836"};
    width: calc(100% + 60px);
    height: 100%;
  }

  .name-and-message {
    display: flex;
    flex-direction: column;
    background: ${({ isYourMessage, isSelected }) =>
      isYourMessage ? "var(--reallyBlue)" : "var(--theme)"};
    color: ${({ isYourMessage }) => (isYourMessage ? "#fff" : "var(--text)")};
    padding: 7px;
    border-radius: ${({ isLast }) => (!isLast ? "10px" : "10px 10px 10px 0")};
    margin-left: 10px;
    max-width: 40%;
    position: relative;

    @keyframes send {
      0% {
        transform: translateY(50px) scale(1.05);
        background: transparent;
        opacity: 0;
        z-index: 100;
      }
      100% {
        transform: translate(0%) scale(1);
        background: ${({ isYourMessage }) =>
          isYourMessage ? "var(--reallyBlue)" : "var(--theme)"};
        opacity: 1;
      }
    }

    .name-and-time {
      b {
        color: ${({ isYourMessage }) =>
          isYourMessage ? "#fff" : "var(--text)"};
        font-size: 0.8em;
        margin-bottom: 5px;
        margin-right: 10px;
      }

      span {
        font-size: 0.7em;
        opacity: 0.8;
      }
    }

    .message {
      font-size: 1em;
    }
  }

  @media (max-width: 1000px) {
    .name-and-message {
      max-width: 70%;
    }
  }
`;

interface Props {
  message: Message;
  isLast: boolean;
}

const MessageItem = ({ message, isLast }: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const {
    data: { selectedChat, selectedMessages },
  } = chatModel.selectors.useChats();

  const handleRightClick = () => {
    contextMenuModel.events.open({
      content: <MessageContextMenu message={message} />,
    });
  };

  if (!user) return null;

  return (
    <MessageItemWrapper
      isYourMessage={user._id === message.sender._id}
      isLast={isLast}
      isSelected={!!selectedMessages.find((m) => m._id === message._id)}
      onClick={() =>
        !!selectedMessages.length &&
        chatModel.events.addSelectedMessages({ message })
      }
      onDoubleClick={() => chatModel.events.addSelectedMessages({ message })}
    >
      <div className="name-and-message" onContextMenu={handleRightClick}>
        <div className="name-and-time">
          <b>{message.sender.name}</b>
          <span>
            {localizeDate(message.createdAt, "hours")}{" "}
            {getMessageReceivedIcon(message.received)}
          </span>
        </div>
        {message.forwardedMessages.map((message) => {
          return <ForwardedMessage message={message} key={message._id} />;
        })}
        <span className="message">
          {prepareContent(message.content ?? "", message, selectedChat, user)}
        </span>
      </div>
    </MessageItemWrapper>
  );
};

export default MessageItem;
