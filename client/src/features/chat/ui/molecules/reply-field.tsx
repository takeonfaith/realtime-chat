import React from "react";
import { FiX } from "react-icons/fi";
import styled from "styled-components";
import { ForwardedMessage } from "..";
import { chatModel } from "../../../../entities/chat";
import { Message } from "../../../../shared/api/model/message";
import { Button } from "../../../../shared/ui/atoms";

const ReplyFieldWrapper = styled.div<{ show: boolean }>`
  width: 100%;
  height: ${({ show }) => (show ? "50px" : "0px")};
  opacity: ${({ show }) => (show ? "1" : "0")};
  background: var(--theme);
  position: absolute;
  left: 0;
  bottom: 45px;
  transition: 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface Props {
  message: Message | null;
}

const ReplyField = ({ message }: Props) => {
  return (
    <ReplyFieldWrapper show={!!message}>
      {message && (
        <>
          <ForwardedMessage message={message} showForwardedMessages={false} />
          <Button
            icon={<FiX />}
            onClick={() => chatModel.events.replyToMessage({ message })}
            background="transparent"
          />
        </>
      )}
    </ReplyFieldWrapper>
  );
};

export default ReplyField;
