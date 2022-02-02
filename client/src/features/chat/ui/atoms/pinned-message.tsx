import React from "react";
import { FiX } from "react-icons/fi";
import styled from "styled-components";
import { Message } from "../../../../shared/api/model/message";
import { Button } from "../../../../shared/ui/atoms";

const PinnedMessageWrapper = styled.div`
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .title {
    font-size: 0.8em;
    color: var(--reallyBlue);
    font-weight: 500;
  }
`;

interface Props {
  message: Message;
}

const PinnedMessage = ({ message }: Props) => {
  return (
    !!message && (
      <PinnedMessageWrapper>
        <div className="pinned-message-content">
          <div className="title">Закрепленное сообщение</div>
          <div className="message-content">
            {!!message.forwardedMessages?.length
              ? "Пересланные сообщения"
              : message.content}
          </div>
        </div>
        <Button icon={<FiX />} onClick={() => null} background="transparent" />
      </PinnedMessageWrapper>
    )
  );
};

export default PinnedMessage;
