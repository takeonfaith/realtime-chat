import React from "react";
import styled from "styled-components";
import { Colors } from "../../consts";

const StatusWrapper = styled.div<{ isOnline: boolean }>`
  padding: 2px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: ${({ isOnline }) => (isOnline ? Colors.green.main : "#8d8d8d")};
  background: ${({ isOnline }) =>
    isOnline ? Colors.green.transparent : "#d8d8d832"};
  font-weight: 600;
  font-size: 0.8em;
`;

interface Props {
  status: "online" | "offline";
}

const Status = ({ status }: Props) => {
  return <StatusWrapper isOnline={status === "online"}>{status}</StatusWrapper>;
};

export default Status;
