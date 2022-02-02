import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { IUser } from "../../../../shared/api/model";
import { User } from "../../../../widgets";

const PinUserWrapper = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 10px;
  background: var(--mild-hover-bg);
  left: 0px;
  bottom: ${({ show }) => (show ? "45px" : "-100px")};
  height: ${({ show }) => (show ? "130px" : "0px")};
  z-index: -2;
`;

interface Props {
  show: boolean;
  users: IUser[];
  chosenUser: number;
}

const PinUser = ({ show, users, chosenUser }: Props) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tagRef?.current) {
      tagRef.current.scrollTop = 48 * chosenUser;
    }
  }, [chosenUser]);

  return (
    <PinUserWrapper show={show} ref={tagRef}>
      {users.map((user, i) => {
        return (
          <User
            {...user}
            status="online"
            key={user._id}
            selected={i === chosenUser}
          />
        );
      })}
    </PinUserWrapper>
  );
};

export default PinUser;
