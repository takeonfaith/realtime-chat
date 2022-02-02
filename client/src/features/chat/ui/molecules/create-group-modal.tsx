import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import { chatApi } from "../../../../shared/api";
import { IUser } from "../../../../shared/api/model";
import { Input, SubmitButton } from "../../../../shared/ui/atoms";
import { useModal } from "../../../../widgets";
import SearchUsers from "../../../search-users";

const CreateGroupModalWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1001px) {
    width: 350px;
    height: 350px;
  }

  .chat-name {
    margin-bottom: 5px;
  }
`;

const CreateGroupModal = () => {
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
      <SearchUsers
        addedUsers={addedUsers}
        setAddedUsers={setAddedUsers}
        title={"Создать беседу"}
        error={error}
      >
        <div className="chat-name">
          <Input
            value={chatName}
            setValue={setChatName}
            placeholder="Название беседы"
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
      </SearchUsers>
    </CreateGroupModalWrapper>
  );
};

export default CreateGroupModal;
