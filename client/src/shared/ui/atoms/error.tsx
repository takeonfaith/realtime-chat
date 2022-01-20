import React from "react";
import styled from "styled-components";
import { Title } from ".";
import Sad from "../../images/sad-emoji.gif";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text);

  img {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  .error-content {
    margin-top: 20px;
  }
`;

interface Props {
  text: string;
  children?: React.ReactNode[] | React.ReactNode | string | null;
}
const Error = ({ text, children }: Props) => {
  return (
    <Container>
      <img src={Sad} alt="груфтим(" />
      <Title size={3}>{text}</Title>
      <div className="error-content">{children}</div>
    </Container>
  );
};

export default Error;
