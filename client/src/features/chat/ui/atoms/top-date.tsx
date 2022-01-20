import React from "react";
import styled from "styled-components";
import { Title } from "../../../../shared/ui/atoms";

const TopDateWrapper = styled.div`
  margin: 5px 0 10px 0;
  color: #fff;
  position: sticky;
  top: 10px;
  z-index: 10;

  h5 {
    background: #313b9b;
    padding: 6px 12px;
    border-radius: var(--brSemi);
    display: inline-block;
  }
`;

interface Props {
  date: string | null;
}

const TopDate = ({ date }: Props) => {
  return !!date ? (
    <TopDateWrapper>
      <Title size={5}>{date}</Title>
    </TopDateWrapper>
  ) : null;
};

export default TopDate;
