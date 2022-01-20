import React from "react";
import styled from "styled-components";
import { Title } from "../../../../shared/ui/atoms";

const AttachmentsWrapper = styled.div`
  @media (min-width: 1001px) {
    width: 500px;
    height: 500px;
  }
`;

const Attachments = () => {
  return (
    <AttachmentsWrapper>
      <Title size={2} align="left">
        Вложения
      </Title>
    </AttachmentsWrapper>
  );
};

export default Attachments;
