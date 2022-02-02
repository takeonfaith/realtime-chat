import React from "react";
import styled from "styled-components";
import { SkeletonShape, Title } from "../../../../shared/ui/atoms";

const AttachmentsWrapper = styled.div`
  @media (min-width: 1001px) {
    width: 415px;
    height: 500px;
  }

  display: flex;
  flex-direction: column;

  .attachment-list {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }
`;

const Attachments = () => {
  return (
    <AttachmentsWrapper>
      <Title size={3} align="left" bottomGap>
        Вложения
      </Title>
      <div className="attachment-list">
        {Array(30)
          .fill(0)
          .map(() => {
            return (
              <SkeletonShape
                shape={"rect"}
                size={{
                  width: "98px",
                  height: "98px",
                }}
                margin="0"
              />
            );
          })}
      </div>
    </AttachmentsWrapper>
  );
};

export default Attachments;
