import React from "react";
import styled from "styled-components";
import { Colors } from "../../consts";

const NotificationsAmountWrapper = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 20px;
  height: 20px;
  background: ${Colors.red.main};
  border-radius: 100%;
  color: #fff;
  border: 3px solid var(--theme);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6em;
  font-weight: bold;
`;

interface Props {
  amount?: number;
}

const NotificationsAmount = ({ amount }: Props) => {
  return amount && amount !== 0 ? (
    <NotificationsAmountWrapper>{amount}</NotificationsAmountWrapper>
  ) : null;
};

export default NotificationsAmount;
