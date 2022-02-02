import React from "react";
import { FiUser, FiUsers } from "react-icons/fi";

import { Container, Img } from "../atoms/avatar";

export default Avatar;

interface Props {
  type?: "user" | "chat";
  avatar?: string;
  width?: string;
  height?: string;
  marginRight?: string;
  background?: string;
}

function Avatar({
  avatar,
  width,
  height,
  marginRight,
  background,
  type = "user",
}: Props) {
  return (
    <Container
      width={width}
      height={height}
      marginRight={marginRight}
      background={background}
    >
      {avatar ? (
        <Img src={avatar} />
      ) : type === "user" ? (
        <FiUser />
      ) : (
        <FiUsers />
      )}
    </Container>
  );
}
