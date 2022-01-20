import React, { useState } from "react";
import styled from "styled-components";
import { chatModel } from "../../../../entities/chat";
import { chatApi } from "../../../../shared/api";
import { Button, SubmitButton, Title } from "../../../../shared/ui/atoms";
import { useModal, User } from "../../../../widgets";
import { User as IUser } from "../../../../shared/api/model/user";
import ErrorMessage from "../../../../pages/login/ui/atoms/error-message";
import LocalSearch from "../../../../shared/ui/molecules/local-search";
import searchPeople from "../../lib/search-people";
import { FiX } from "react-icons/fi";
import { Colors } from "../../../../shared/consts";
import arraysMatch from "../../../../shared/lib/array-match";
import filterArrayWithArray from "../../../../shared/lib/filter-array-with-array";

const AddToGroupModalWrapper = styled.div`
  @media (min-width: 1001px) {
    width: 350px;
    height: 350px;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .added-users {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: #fff;
    flex-wrap: wrap;
    width: 100%;

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
    max-height: 250px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
`;

interface Props {
  chatId: string;
  users: IUser[];
}

const AddToGroupModal = ({ chatId, users }: Props) => {
  const [foundUsers, setFoundUsers] = useState<IUser[]>([]);
  const [addedUsers, setAddedUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [completed, setCompleted] = useState(false);
  const { close } = useModal();

  const handleAdd = async () => {
    try {
      setLoading(true);
      const promises = addedUsers.map(async (user) => {
        return await chatApi.addToGroup(chatId, user._id);
      });

      Promise.all(promises).then((res) => {
        setLoading(false);
        setCompleted(true);
        chatModel.events.changeSelectedChat({ chat: res[res.length - 1].data });

        close();
      });
    } catch (error) {
      setLoading(false);
      setError("Не удалось добавить пользователя");
    }
  };
  return (
    <AddToGroupModalWrapper>
      <Title size={3} align="left" bottomGap>
        Добавить в беседу
      </Title>
      <ErrorMessage message={error} />
      <LocalSearch
        searchEngine={searchPeople}
        setResult={(searchedUsers: IUser[]) => {
          if (searchedUsers) {
            const filteredUsers = searchedUsers.filter(
              (u) => !users.find((user) => user._id === u._id)
            );
            setFoundUsers(filteredUsers);
          }
        }}
        placeholder="Поиск людей"
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
              {...user}
              status="online"
              setAdded={setAddedUsers}
              added={!!addedUsers.find((u: IUser) => u._id === user._id)}
            />
          );
        })}
      </div>
      <SubmitButton
        text={"Добавить"}
        action={handleAdd}
        isLoading={loading}
        completed={completed}
        setCompleted={setCompleted}
        isActive={addedUsers.length >= 1 && !!addedUsers.length}
      />
    </AddToGroupModalWrapper>
  );
};

export default AddToGroupModal;
