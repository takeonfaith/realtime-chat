import React, { useMemo, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { userApi } from "../../../../shared/api";
import { IUser } from "../../../../shared/api/model";
import { Colors } from "../../../../shared/consts";
import { Button, Loading, Title } from "../../../../shared/ui/atoms";
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

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const handleAccept = async (friend: IUser) => {
    if (friend._id) {
      try {
        setAcceptLoading(true);
        await userApi.acceptFriend(friend._id);
        userModel.events.addFriend({ friend });
        setAcceptLoading(false);
      } catch (error) {
        setAcceptLoading(false);
      }
    }
  };

  const handleReject = (friend: IUser) => {};

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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(user);
                  }}
                  icon={!acceptLoading ? <FiCheck /> : <Loading width="20px" />}
                  textColor={Colors.green.main}
                  background={Colors.green.transparent}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(user);
                  }}
                  icon={!rejectLoading ? <FiX /> : <Loading width="20px" />}
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
