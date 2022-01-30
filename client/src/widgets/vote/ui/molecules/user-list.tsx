import React from "react";
import styled from "styled-components";
import { User } from "../../..";
import { User as IUser } from "../../../../shared/api/model";

const UserListWrapper = styled.div`
  width: 300px;
  height: 300px;
  overflow: auto;
`;

interface Props {
  users: IUser[];
}

const UserList = ({ users }: Props) => {
  return (
    <UserListWrapper>
      {users.map((user) => {
        return <User {...user} status="online" key={user._id} />;
      })}
    </UserListWrapper>
  );
};

export default UserList;
