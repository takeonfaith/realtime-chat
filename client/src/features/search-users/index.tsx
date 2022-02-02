import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import styled from "styled-components";
import { userModel } from "../../entities/user";
import ErrorMessage from "../../pages/login/ui/atoms/error-message";
import { IUser } from "../../shared/api/model";
import { Colors } from "../../shared/consts";
import { Button, Title } from "../../shared/ui/atoms";
import LocalSearch from "../../shared/ui/molecules/local-search";
import { User } from "../../widgets";
import searchPeople from "./lib/search-people";

const SearchUsersWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .added-users {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    flex-wrap: wrap;

    .added-user {
      font-size: 0.8em;
      display: flex;
      align-items: center;
      background: ${Colors.blue.main};
      margin-top: 5px;
      border-radius: 20px;
      padding: 1px 10px;
      font-weight: bold;
      margin-right: 5px;

      button {
        width: 22px;
        height: 22px;
        padding: 0;
      }
    }
  }

  .users-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    margin: 5px 0;
  }
`;

interface Props {
  addedUsers: IUser[];
  setAddedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  title: string;
  error: string;
  children?: React.ReactNode[] | React.ReactNode;
}

const SearchUsers = ({
  addedUsers,
  title,
  error,
  setAddedUsers,
  children,
}: Props) => {
  const {
    data: { addedFriends },
  } = userModel.selectors.useUser();
  const [foundUsers, setFoundUsers] = useState<IUser[]>([]);

  return (
    <SearchUsersWrapper>
      <Title size={3} align="left" bottomGap>
        {title}
      </Title>
      <ErrorMessage message={error} />
      <LocalSearch
        searchEngine={searchPeople}
        setResult={setFoundUsers}
        placeholder="Поиск людей"
        defaultList={addedFriends}
      />
      <div className="added-users">
        {addedUsers.map((user) => {
          return (
            <div className="added-user">
              <span> {user.name}</span>
              <Button
                onClick={() =>
                  setAddedUsers((prev: IUser[]) =>
                    prev.filter((u) => user._id !== u._id)
                  )
                }
                icon={<FiX />}
                background="transparent"
                textColor="#fff"
              />
            </div>
          );
        })}
      </div>
      <div className="users-list">
        {foundUsers?.map((user) => {
          return (
            <User
              key={user._id}
              {...user}
              status="online"
              setAdded={setAddedUsers}
              added={!!addedUsers.find((u: IUser) => u._id === user._id)}
            />
          );
        })}
      </div>
      {children}
    </SearchUsersWrapper>
  );
};

export default SearchUsers;
