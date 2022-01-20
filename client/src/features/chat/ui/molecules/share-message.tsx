import React from "react";
import styled from "styled-components";
import { Message } from "../../../../shared/api/model/message";
import { Title } from "../../../../shared/ui/atoms";

const ShareMessageWrapper = styled.div`
  width: 400px;
`;

interface Props {
  message: Message;
}

const ShareMessage = ({ message }: Props) => {
  return (
    <ShareMessageWrapper>
      <Title size={2} align="left">
        Переслать сообщение
      </Title>
    </ShareMessageWrapper>
  );
};

export default ShareMessage;
