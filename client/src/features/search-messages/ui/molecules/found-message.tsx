import React from "react";
import styled from "styled-components";
import { Message } from "../../../../shared/api/model";
import { Avatar } from "../../../../shared/ui/molecules";

const FoundMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 5px 0;
  padding: 5px;
  border-radius: var(--brLight);

  .name-and-message {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    .name {
      font-size: 0.8em;
    }

    .message {
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      display: block;
      width: 100%;
      text-overflow: ellipsis;
    }
  }
`;

interface Props {
  message: Message;
}

const FoundMessage = ({ message }: Props) => {
  return (
    <FoundMessageWrapper>
      <Avatar width="35px" height="35px" marginRight="5px" />
      <div className="name-and-message">
        <b className="name">{message.sender.name}</b>
        <div className="message">{message.content}</div>
      </div>
    </FoundMessageWrapper>
  );
};

export default FoundMessage;
