import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PinnedMessage } from "..";
import { chatModel } from "../../../../entities/chat";
import limitNumber from "../../../../shared/lib/limit-number";

const HeaderPinnedMessageWrapper = styled.div<{ showPinnedMessage: boolean }>`
  border-top: 1px solid var(--mild-hover-bg);
  transition: 0.2s height;
  height: ${({ showPinnedMessage }) => (showPinnedMessage ? "45px" : "0")};
  display: flex;
  align-items: center;
  padding: 0 7px;

  .pinned-pages {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 10px;
    height: 80%;

    & > * + * {
      margin-top: 2px;
    }

    .pinned-page {
      width: 3px;
      height: 100%;
      background: var(--mild-hover-bg);
      display: block;
      border-radius: 10px;

      &.current {
        background: var(--blue);
      }
    }
  }
`;

interface Props {
  showPinnedMessage: boolean;
}

const HeaderPinnedMessage = ({ showPinnedMessage }: Props) => {
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();
  const [currentPinnedMessage, setCurrentPinnedMessage] = useState(
    (selectedChat?.pinnedMessages?.length ?? 1) - 1
  );

  useEffect(() => {
    setCurrentPinnedMessage((selectedChat?.pinnedMessages?.length ?? 1) - 1);
  }, [selectedChat?._id]);

  return (
    <HeaderPinnedMessageWrapper
      showPinnedMessage={showPinnedMessage}
      onClick={() =>
        setCurrentPinnedMessage(
          limitNumber(
            currentPinnedMessage + 1,
            (selectedChat?.pinnedMessages?.length ?? 1) - 1
          )
        )
      }
    >
      {(selectedChat?.pinnedMessages?.length ?? 0) >= 2 && (
        <div className="pinned-pages">
          {selectedChat?.pinnedMessages?.map((page, i) => {
            return (
              <div
                className={`pinned-page ${
                  currentPinnedMessage === i ? "current" : ""
                }`}
              />
            );
          })}
        </div>
      )}
      {!!selectedChat?.pinnedMessages?.length && (
        <PinnedMessage
          message={selectedChat?.pinnedMessages[currentPinnedMessage]}
        />
      )}
    </HeaderPinnedMessageWrapper>
  );
};

export default HeaderPinnedMessage;
