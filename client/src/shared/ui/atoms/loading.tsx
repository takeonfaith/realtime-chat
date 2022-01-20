import React from "react";
import styled from "styled-components";

const LoadingWrapper = styled.img<{ width: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

interface Props {
  width?: string;
}

const Loading = ({ width = "auto" }: Props) => {
  return (
    <LoadingWrapper
      src="https://media0.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif"
      alt="loading"
      className="loading-circle"
      width={width}
    />
  );
};

export default Loading;
