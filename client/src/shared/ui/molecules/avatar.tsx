import React from "react";
import { FiUser } from "react-icons/fi";

import { Container, Img } from "../atoms/avatar";

export default Avatar;

interface Props {
  avatar?: string;
  width?: string;
  height?: string;
  marginRight?: string;
  background?: string;
}

function Avatar({ avatar, width, height, marginRight, background }: Props) {
  return (
    <Container
      width={width}
      height={height}
      marginRight={marginRight}
      background={background}
    >
      {avatar ? <Img src={avatar} /> : <FiUser />}
    </Container>
  );
}
