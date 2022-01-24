import React, { memo } from "react";
import styled from "styled-components";
import NotificationsAmount from "./notifications-amount";

const ButtonWrapper = styled.button<{
  text: boolean;
  isChosen: boolean;
  width?: string;
  background?: string;
  textColor?: string;
  shrinkTextInMobile: boolean;
  hoverBackground?: string;
  largeIcon: boolean;
  direction: "horizontal" | "vertical";
  align?: "left" | "center" | "right";
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align ?? "center"};
  border: none;
  color: ${({ textColor }) => (textColor ? textColor : "var(--text)")};
  background: ${({ isChosen, background }) =>
    isChosen ? "var(--blue)" : background ?? "var(--scheduleBg)"};
  padding: 10px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s transform;
  width: ${({ width }) => (width ? width : "fit-content")};
  text-decoration: none;
  flex-direction: ${({ direction }) => direction === "vertical" && "column"};
  position: relative;

  &:focus {
    outline: 4px solid var(--almostTransparentOpposite);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: ${({ hoverBackground, isChosen, background }) =>
      hoverBackground ??
      (isChosen ? "var(--blue)" : background ?? "var(--mild-hover-bg)")};
  }

  svg {
    margin-right: ${({ text, direction }) =>
      text && direction === "horizontal" ? "7px" : "0"};
    width: ${({ direction, largeIcon }) =>
      direction === "vertical" ? "20px" : !largeIcon ? "15px" : "18px"};
    height: ${({ direction, largeIcon }) =>
      direction === "vertical" ? "20px" : !largeIcon ? "15px" : "18px"};
    margin-bottom: ${({ direction }) => direction === "vertical" && "4px"};
  }

  @media (max-width: 1000px) {
    font-size: 12px;
    height: 36px;

    svg {
      width: ${({ direction }) => (direction === "vertical" ? "30px" : "14px")};
      height: ${({ direction }) =>
        direction === "vertical" ? "30px" : "14px"};
      margin-right: ${({ shrinkTextInMobile, text, direction }) =>
        shrinkTextInMobile || direction === "vertical" || !text
          ? "0px"
          : "7px"};
    }

    span {
      display: ${({ shrinkTextInMobile }) =>
        shrinkTextInMobile ? "none" : "flex"};
    }
  }
`;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: JSX.Element;
  text?: React.ReactNode | string;
  onClick: (event: any) => void;
  isChosen?: boolean;
  width?: string;
  background?: string;
  textColor?: string;
  shrinkTextInMobile?: boolean;
  hoverBackground?: string;
  align?: "left" | "center" | "right";
  direction?: "horizontal" | "vertical";
  restProps?: any | unknown;
  largeIcon?: boolean;
  notifications?: number;
}

const Button = ({
  icon,
  text,
  onClick,
  width,
  background,
  textColor,
  hoverBackground,
  align,
  isChosen = false,
  direction = "horizontal",
  shrinkTextInMobile = false,
  largeIcon = false,
  notifications,
  ...restProps
}: Props) => {
  return (
    <ButtonWrapper
      text={!!text}
      onClick={onClick}
      isChosen={isChosen}
      width={width}
      background={background}
      textColor={textColor}
      shrinkTextInMobile={shrinkTextInMobile}
      hoverBackground={hoverBackground}
      align={align}
      direction={direction}
      largeIcon={largeIcon}
      {...restProps}
    >
      <NotificationsAmount amount={notifications} />
      {!!icon && icon}
      <span>{text}</span>
    </ButtonWrapper>
  );
};

export default memo(Button);
