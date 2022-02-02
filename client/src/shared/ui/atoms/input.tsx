import React, { useState } from "react";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import styled from "styled-components";
import { Loading } from ".";
import Button from "./button";

const InputWrapper = styled.div<{ leftIcon: boolean; background?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  color: var(--text);

  h5 {
    margin-bottom: 5px;
  }

  .icon {
    position: absolute;
    left: 7px;
    top: 55%;
    transform: translateY(-50%);
    color: var(--theme-strong-transparent-opposite);
    opacity: 0.4;
  }

  input {
    border: none;
    color: var(--text);
    outline: none;
    background: ${({ background }) => background ?? " var(--scheduleBg)"};
    height: 100%;
    width: 100%;
    padding: 10px;
    font-weight: bold;
    border-radius: 7px;
    padding-left: ${({ leftIcon }) => (leftIcon ? "30px" : "10px")};
    padding-right: 35px;

    &::placeholder {
      font-weight: 500;
      color: var(--theme-strong-transparent-opposite);
    }

    /* &:focus-visible {
      outline: 4px solid #ffffff1c;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    } */
  }

  button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    padding: 0;

    &:active {
      transform: scale(1);
    }

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

interface Props {
  value: string;
  setValue: (value: string) => void;
  leftIcon?: React.ReactNode;
  title?: string;
  placeholder?: string;
  type?: string;
  background?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

const Input = ({
  value,
  setValue,
  leftIcon,
  title,
  background,
  onKeyDown,
  placeholder = "Введите сюда",
  type = "text",
  loading = false,
}: Props) => {
  const [inputType, setInputType] = useState(type);
  return (
    <InputWrapper
      leftIcon={!!leftIcon}
      className="input-wrapper"
      background={background}
    >
      {!!title && <h5>{title}</h5>}
      {leftIcon && <span className="icon">{leftIcon}</span>}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {type !== "password" ? (
        !!value.length && (
          <Button
            icon={!loading ? <FiX /> : <Loading width="20px" />}
            onClick={() => !loading && setValue("")}
            tabIndex={-1}
          />
        )
      ) : (
        <Button
          icon={inputType === "password" ? <FiEye /> : <FiEyeOff />}
          tabIndex={-1}
          onClick={() =>
            setInputType((prev) => (prev === "password" ? "text" : "password"))
          }
        />
      )}
    </InputWrapper>
  );
};

export default Input;
