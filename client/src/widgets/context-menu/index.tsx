import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { contextMenuModel } from "../../entities/context-menu";
import calcPosition from "./lib/calc-position";

const ContextMenuWrapper = styled.div<{
  isVisible: boolean;
  left: number;
  top: number;
}>`
  height: fit-content;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  transform: ${({ isVisible }) =>
    isVisible ? "translateY(0px)" : "translateY(20px)"};
  position: absolute;
  width: 250px;
  left: ${({ left }) => left + "px"};
  top: ${({ top }) => top + "px"};
  background: var(--theme);
  border-radius: var(--brLight);
  box-shadow: 0 0 20px #0000003b;
  transition: 0.2s opacity;
  z-index: 4;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 500px) {
    width: calc(100vw - 20px);
  }
`;

const ContextMenu = () => {
  const { open, content, position } =
    contextMenuModel.selectors.useContextMenu();
  const contextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (!open) {
        calcPosition(
          e,
          contextRef.current?.offsetWidth,
          contextRef.current?.offsetHeight
        );
      }
    });
    window.addEventListener("contextmenu", (e) => {
      calcPosition(
        e,
        contextRef.current?.offsetWidth,
        contextRef.current?.offsetHeight
      );
    });
  }, [open]);

  return (
    <ContextMenuWrapper
      isVisible={open}
      ref={contextRef}
      left={position.x}
      top={position.y}
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </ContextMenuWrapper>
  );
};

export default ContextMenu;
