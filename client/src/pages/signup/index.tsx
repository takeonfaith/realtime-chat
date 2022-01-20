import React from "react";
import styled from "styled-components";
import SignUp from "./ui/organisms/signup-block";

const SignUpWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--theme);
  flex-direction: column;

  img {
    width: 100%;
    max-width: 250px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 1000px) {
    align-items: flex-end;
  }
`;

const SignUpPage = () => {
  return (
    <SignUpWrapper>
      <SignUp />
    </SignUpWrapper>
  );
};

export default SignUpPage;
