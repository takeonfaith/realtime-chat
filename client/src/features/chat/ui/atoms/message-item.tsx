import React from "react";
import { FiCornerUpLeft, FiCornerUpRight, FiX } from "react-icons/fi";
import styled from "styled-components";
import { contextMenuModel } from "../../../../entities/context-menu";
import { userModel } from "../../../../entities/user";
import { Message } from "../../../../shared/api/model/message";
import localizeDate from "../../../../shared/lib/localize-date";
import { Button } from "../../../../shared/ui/atoms";
import getMessageReceivedIcon from "../../lib/get-message-received-icon";
import ShareMessage from "../molecules/share-message";

const MessageItemWrapper = styled.div<{
  isYourMessage: boolean;
  isLast: boolean;
}>`
  display: flex;
  align-items: flex-end;
  padding: ${({ isLast }) => (!isLast ? "2px 0" : "2px 0 10px 0")};
  position: static;

  .message-avatar {
    width: 32px;
    height: 32px;

    position: sticky;
    bottom: 0px;
    top: 0px;
  }

  .name-and-message {
    display: flex;
    flex-direction: column;
    background: ${({ isYourMessage }) =>
      isYourMessage ? "var(--reallyBlue)" : "var(--theme)"};
    color: ${({ isYourMessage }) => (isYourMessage ? "#fff" : "var(--text)")};
    padding: 7px;
    border-radius: ${({ isLast }) => (!isLast ? "10px" : "10px 10px 10px 0")};
    margin-left: 10px;
    max-width: 40%;
    position: relative;

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
  name: string;
  message: Message;
  isLast: boolean;
}

const MessageItem = ({ name, message, isLast }: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();

  const handleRightClick = () => {
    contextMenuModel.events.open({
      content: (
        <>
          <Button
            icon={<FiCornerUpLeft />}
            text={"Ответить"}
            onClick={() => null}
            width="100%"
            align="left"
            background="transparent"
          />
          <Button
            icon={<FiCornerUpRight />}
            text={"Переслать"}
            onClick={() => <ShareMessage message={message} />}
            width="100%"
            align="left"
            background="transparent"
          />
          <Button
            icon={<FiX />}
            text={"Удалить"}
            onClick={() => null}
            width="100%"
            align="left"
            background="transparent"
          />
        </>
      ),
    });
  };

  if (!user) return null;

  return (
    <MessageItemWrapper
      isYourMessage={user._id === message.sender._id}
      isLast={isLast}
    >
      <div className="name-and-message" onContextMenu={handleRightClick}>
        <div className="name-and-time">
          <b>{name}</b>
          <span>
            {localizeDate(message.createdAt, "hours")}{" "}
            {getMessageReceivedIcon(message.received)}
          </span>
        </div>
        <span className="message">{message.content}</span>
      </div>
    </MessageItemWrapper>
  );
};

export default MessageItem;
