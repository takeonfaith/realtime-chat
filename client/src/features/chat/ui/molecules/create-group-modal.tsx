import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import ErrorMessage from "../../../../pages/login/ui/atoms/error-message";
import { chatApi } from "../../../../shared/api";
import { User as IUser } from "../../../../shared/api/model";
import { Colors } from "../../../../shared/consts";
import {
  Button,
  Error,
  Input,
  SubmitButton,
  Title,
} from "../../../../shared/ui/atoms";
import LocalSearch from "../../../../shared/ui/molecules/local-search";
import { useModal, User } from "../../../../widgets";
import searchPeople from "../../lib/search-people";

const CreateGroupModalWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1001px) {
    width: 400px;
    height: 400px;
  }

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

  .chat-name {
    margin-bottom: 5px;
  }
`;

const CreateGroupModal = () => {
  const [foundUsers, setFoundUsers] = useState<IUser[]>([]);
  const [addedUsers, setAddedUsers] = useState<IUser[]>([]);
  const [chatName, setChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [completed, setCompleted] = useState(false);
  const history = useHistory();
  const { close } = useModal();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const { data } = await chatApi.createGroupChat(
        addedUsers.map((user) => user._id),
        chatName
      );
      chatModel.events.changeSelectedChat({ chat: data });

      setLoading(false);
      setCompleted(true);
      close();
      history.push(`${CHAT_ROUTE}/${data._id}`);
    } catch (error) {
      setLoading(false);
      setError("Не удалось создать беседу");
    }
  };

  return (
    <CreateGroupModalWrapper>
      <Title size={2} align="left" bottomGap>
        Создать беседу
      </Title>
      <ErrorMessage message={error} />
      <LocalSearch
        searchEngine={searchPeople}
        setResult={setFoundUsers}
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
      {addedUsers.length >= 2 && (
        <>
          <div className="chat-name">
            <Input
              value={chatName}
              setValue={setChatName}
              placeholder="Название чата"
            />
          </div>
          <SubmitButton
            text={"Создать"}
            action={handleCreate}
            isLoading={loading}
            completed={completed}
            setCompleted={setCompleted}
            isActive={!!chatName.length && addedUsers.length >= 2}
          />
        </>
      )}
    </CreateGroupModalWrapper>
  );
};

export default CreateGroupModal;
