import React from "react";
import styled from "styled-components";
import { Message } from "../../../../shared/api/model/message";
import localizeDate from "../../../../shared/lib/localize-date";

const ForwardedMessageWrapper = styled.div`
  height: fit-content;
  display: flex;
  align-items: flex-start;
  width: 100%;
  background: #00000011;
  padding: 7px 5px;
  padding-left: 10px;

  .f-name-and-message {
    display: flex;
    flex-direction: column;
    background: transparent;
    position: relative;

    .f-name-and-time {
      display: flex;
      align-items: flex-start;
      height: fit-content;
      b {
        font-size: 0.8em;
        margin-right: 10px;
      }

      span {
        font-size: 0.7em;
        opacity: 0.8;
      }
    }

    .f-message {
      font-size: 1em;
    }

    &::before {
      content: "";
      width: 3px;
      height: calc(100% + 14px);
      position: absolute;
      left: -10px;
      top: -7px;
      background: var(--purple);
      display: block;
    }
  }
`;

interface Props {
  message: Message;
  showForwardedMessages?: boolean;
}

const ForwardedMessage = ({ message, showForwardedMessages = true }: Props) => {
  return (
    <ForwardedMessageWrapper>
      <div className="f-name-and-message">
        <div className="f-name-and-time">
          <b>{message.sender.name}</b>
          <span>{localizeDate(message.createdAt, "hours")} </span>
        </div>
        {showForwardedMessages &&
          message.forwardedMessages.map((message) => {
            return <ForwardedMessage message={message} key={message._id} />;
          })}
        <span className="f-message">
          {message.content}{" "}
          {!!message.forwardedMessages.length && "Пересланные сообщения"}
        </span>
      </div>
    </ForwardedMessageWrapper>
  );
};

export default ForwardedMessage;
