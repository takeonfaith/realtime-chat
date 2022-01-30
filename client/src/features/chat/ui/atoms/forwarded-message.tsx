import React from "react";
import styled from "styled-components";
import { Message } from "../../../../shared/api/model/message";
import localizeDate from "../../../../shared/lib/localize-date";
import { Avatar } from "../../../../shared/ui/molecules";
import prepareContent from "../../lib/prepare-content";

const ForwardedMessageWrapper = styled.div`
  height: fit-content;
  display: flex;
  align-items: flex-start;
  width: 100%;
  background: #00000011;
  padding: 7px 5px;
  padding-left: 10px;

  .name-and-message {
    display: flex;
    min-width: 200px;
    background: transparent;
    margin-left: 0;
    padding: 0;

    .name-and-time {
      display: flex;
      width: 100%;

      b {
        margin-bottom: 0;
      }
    }
    &::before {
      content: "";
      width: 3px;
      height: calc(100% + 14px);
      position: absolute;
      left: -50px;
      top: -7px;
      background: var(--purple);
      display: block;
    }
  }
`;

interface Props {
  message: Message;
}

const ForwardedMessage = ({ message }: Props) => {
  return (
    <ForwardedMessageWrapper>
      <Avatar width="35px" height="35px" marginRight="5px" />
      <div className="name-and-message">
        <div className="name-and-time">
          <b>{message.sender.name}</b>
          <span>{localizeDate(message.createdAt, "hours")} </span>
        </div>
        {message.forwardedMessages.map((message) => {
          return <ForwardedMessage message={message} key={message._id} />;
        })}
        <span className="message">{message.content}</span>
      </div>
    </ForwardedMessageWrapper>
  );
};

export default ForwardedMessage;
