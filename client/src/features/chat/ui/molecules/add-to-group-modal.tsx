import React, { useState } from "react";
import styled from "styled-components";
import { chatModel } from "../../../../entities/chat";
import { chatApi } from "../../../../shared/api";
import { IUser } from "../../../../shared/api/model/user";
import { SubmitButton } from "../../../../shared/ui/atoms";
import { useModal } from "../../../../widgets";
import SearchUsers from "../../../search-users";

const AddToGroupModalWrapper = styled.div`
  @media (min-width: 1001px) {
    width: 350px;
    height: 350px;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

interface Props {
  chatId: string;
  users: IUser[];
}

const AddToGroupModal = ({ chatId, users }: Props) => {
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
      <SearchUsers
        addedUsers={addedUsers}
        setAddedUsers={setAddedUsers}
        title={"Добавить в беседу"}
        error={error}
      >
        <SubmitButton
          text={"Добавить"}
          action={handleAdd}
          isLoading={loading}
          completed={completed}
          setCompleted={setCompleted}
          isActive={addedUsers.length >= 1 && !!addedUsers.length}
        />
      </SearchUsers>
    </AddToGroupModalWrapper>
  );
};

export default AddToGroupModal;
