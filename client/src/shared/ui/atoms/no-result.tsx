import React from "react";
import styled from "styled-components";
import { Title } from ".";

const NoResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

interface Props {
  show: boolean;
}

const NoResult = ({ show }: Props) => {
  return show ? (
    <NoResultWrapper>
      <Title size={3}>Нет результатов</Title>
      <img
        src={
          "https://ouch-cdn2.icons8.com/6xR7hLv0Cu7cNZTYf-TWggmFVxX_Cr_54b2S_KF_SvE/rs:fit:912:912/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTU1/LzQ1MThiYWQ2LTM5/ZGUtNDdjMC04YmZi/LWIyYmIzODkzMzkz/Zi5zdmc.png"
        }
        alt="e"
        style={{ width: "120px" }}
      />
    </NoResultWrapper>
  ) : null;
};

export default NoResult;
