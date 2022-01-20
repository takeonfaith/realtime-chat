import React from "react";
import styled from "styled-components";
import { Colors } from "../../../../shared/consts";

const TypingAnimationWrapper = styled.div`
  background: ${Colors.blue.transparent};
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 50px;
  padding: 7px 5px;
  border-radius: 10px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: ${Colors.blue.main};
    animation: typing 1s infinite;
  }

  span:nth-child(2) {
    animation: typing 1s infinite;
    animation-delay: 0.1s;
  }
  span:nth-child(3) {
    animation: typing 1s infinite;
    animation-delay: 0.2s;
  }

  @keyframes typing {
    0% {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
    33% {
      opacity: 0.5;
      transform: scale(0.95) translateX(1px);
    }
    66% {
      opacity: 0.5;
      transform: scale(0.95) translateX(-1px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }
`;

const TypingAnimation = () => {
  return (
    <TypingAnimationWrapper>
      <span />
      <span />
      <span />
    </TypingAnimationWrapper>
  );
};

export default TypingAnimation;
