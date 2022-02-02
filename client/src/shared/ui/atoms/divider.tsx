import React from "react";
import styled from "styled-components";

const DividerLine = styled.div<{ margin?: string }>`
  width: 90%;
  min-height: 0.5px;
  background: var(--theme-transparent-opposite);
  margin: ${({ margin }) => margin ?? "5px auto"};
`;

interface Props {
  margin?: string;
}

const Divider = ({ margin }: Props) => {
  return <DividerLine margin={margin} />;
};

export default Divider;
