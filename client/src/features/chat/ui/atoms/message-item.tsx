import React from "react";
import { FiCornerUpLeft, FiCornerUpRight, FiX } from "react-icons/fi";
import styled from "styled-components";
import { MessageLink } from ".";
import { chatModel } from "../../../../entities/chat";
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
  name: string;
  message: Message;
  isLast: boolean;
}

const MessageItem = ({ name, message, isLast }: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();

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

  const prepareContent = (value: string) => {
    const words = value.split(/\s/g);
    let result: React.ReactNode[] = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.includes("@") || word.includes("#") || word.includes("http")) {
        if (word[word.length - 1] !== ",") {
          result.push(
            <MessageLink
              text={word}
              isYourMessage={user?._id === message.sender._id}
              user={selectedChat?.users.find(
                (user) => "@" + user.login === word
              )}
              isRealLink={word.includes("http")}
            />
          );
        } else {
          result.push(
            <MessageLink
              text={word.substring(0, word.length - 1)}
              isYourMessage={user?._id === message.sender._id}
              user={selectedChat?.users.find(
                (user) =>
                  "@" + user.login === word.substring(0, word.length - 1)
              )}
              isRealLink={word.includes("http")}
            />
          );
        }
      } else result.push(" " + word);
    }
    return result;
  };

  // prepareContent(message.content ?? "");

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
        <span className="message">{prepareContent(message.content ?? "")}</span>
      </div>
    </MessageItemWrapper>
  );
};

export default MessageItem;
