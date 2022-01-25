import React, { useMemo } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { Colors } from "../../../../shared/consts";
import { Button, Title } from "../../../../shared/ui/atoms";
import { User } from "../../../../widgets";

const FriendRequestWrapper = styled.div``;

const ButtonsList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > * + * {
    margin-left: 5px;
  }
`;

const FriendRequest = () => {
  const {
    data: { friendRequests },
  } = userModel.selectors.useUser();

  const handleAccept = () => {};

  const handleReject = () => {};

  return !!friendRequests ? (
    <FriendRequestWrapper>
      <Title size={5} align="left" bottomGap>
        Заявки в друзья
      </Title>
      {friendRequests.map(({ user }) => {
        return (
          <User
            {...user}
            status="online"
            key={user.name}
            actionOnUser={
              <ButtonsList>
                <Button
                  onClick={handleAccept}
                  icon={<FiCheck />}
                  textColor={Colors.green.main}
                  background={Colors.green.transparent}
                />
                <Button
                  onClick={handleReject}
                  icon={<FiX />}
                  textColor={Colors.red.main}
                  background={Colors.red.transparent}
                />
              </ButtonsList>
            }
          />
        );
      })}
    </FriendRequestWrapper>
  ) : null;
};

export default FriendRequest;
