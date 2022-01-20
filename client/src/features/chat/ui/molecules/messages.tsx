import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styled from "styled-components";
import { MessageList } from ".";
import { chatApi } from "../../../../shared/api";
import { Message } from "../../../../shared/api/model/message";
import { Button, Wrapper } from "../../../../shared/ui/atoms";
import scrollToBottom from "../../lib/scroll-to-bottom";
import TypingAnimation from "../atoms/typing-animation";

const MessagesWrapper = styled.div<{ buttonVisible: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;

  & > button {
    position: fixed;
    right: 12%;
    bottom: 110px;
    min-width: 35px;
    height: 35px;
    border-radius: 100%;
    padding: 0px;
    background: var(--settings);
    transition: 0.2s visibility, 0.2s opacity, 0.2s transform;
    visibility: ${({ buttonVisible }) =>
      buttonVisible ? "visible" : "hidden"};
    opacity: ${({ buttonVisible }) => (buttonVisible ? "1" : "0")};
    transform: scale(${({ buttonVisible }) => (buttonVisible ? "1" : "0.9")});

    svg {
      width: 22px;
      height: 22px;
    }
  }

  @media (max-width: 1000px) {
    button {
      position: fixed;
      right: 20px;
      bottom: 70px;
      border-radius: 100%;
    }
  }
`;

interface Props {
  messages: Message[];
  loading: boolean;
  isTyping: boolean;
}

const Messages = ({ messages, loading, isTyping }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);

  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    scrollToBottom(listRef);
  }, [messages.length]);

  const handleScroll = () => {
    if (!!listRef.current) {
      const isScrolledEnough =
        listRef.current.scrollHeight -
          listRef.current.offsetHeight -
          listRef.current?.scrollTop >
        350;
      setButtonVisible(isScrolledEnough);
    }
  };

  return (
    <MessagesWrapper
      ref={listRef}
      buttonVisible={buttonVisible}
      // onScroll={handleScroll}
    >
      <Wrapper loading={loading} load={() => null} error={null} data={!loading}>
        <MessageList messages={messages} isTyping={isTyping} />
      </Wrapper>
      {/* <Button
        icon={<FiChevronDown />}
        onClick={() => scrollToBottom(listRef)}
      /> */}
    </MessagesWrapper>
  );
};

export default Messages;
