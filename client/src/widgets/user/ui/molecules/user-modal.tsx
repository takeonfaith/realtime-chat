import React, { useState } from "react";
import {
  FiLogOut,
  FiMessageCircle,
  FiMinusCircle,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
} from "react-icons/fi";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useModal } from "../../..";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import { confirmModel } from "../../../../entities/confirm";
import { userModel } from "../../../../entities/user";
import ErrorMessage from "../../../../pages/login/ui/atoms/error-message";
import { chatApi, userApi } from "../../../../shared/api";
import { Colors } from "../../../../shared/consts";
import { Button, Loading, Status } from "../../../../shared/ui/atoms";
import { Avatar } from "../../../../shared/ui/molecules";

const UserModalWrapper = styled.div`
  width: 230px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .name-and-login {
    display: flex;
    align-items: center;
    margin: 10px 0;

    span {
      font-size: 0.7em;
      font-weight: bold;
      opacity: 0.5;
      margin-left: 5px;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;

    & > * + * {
      margin-left: 5px;
    }
  }
`;

interface Props {
  avatar?: string;
  name: string;
  _id?: string;
  status: "online" | "offline";
  login: string;
}

const UserModal = ({ avatar, name, _id, status, login }: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const { close } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const [addLoading, setAddLoading] = useState(false);

  const createChat = async () => {
    if (user?._id && _id) {
      try {
        setLoading(true);

        const { data } = await chatApi.createChat(user._id, _id);

        chatModel.events.changeSelectedChat({ chat: data });
        close();
        setLoading(false);
        history.push(`${CHAT_ROUTE}/${data?._id}`);
      } catch (error) {
        setLoading(false);
        setError("Не удалось создать чат");
      }
    }
  };

  const addFriendHandle = async () => {
    if (_id) {
      try {
        setAddLoading(true);
        const { data } = await userApi.addFriend(_id);
        userModel.events.addFriend({ friend: { _id, name, login } });
        setAddLoading(false);
      } catch (error) {}
    }
  };

  return (
    <UserModalWrapper>
      <ErrorMessage message={error} />
      <Avatar type="user" width="120px" height="120px" marginRight="0" />
      <div className="name-and-login">
        <b>{name}</b>
        <span>@{login}</span>
      </div>
      <Status status={"offline"} />
      <div className="buttons">
        {_id === user?._id ? (
          <Button
            icon={<FiLogOut />}
            onClick={() => {
              confirmModel.events.evokeConfirm({
                message: "Вы уверены, что хотите выйти?",
                onConfirm: () => {
                  userModel.events.logout();
                  close();
                },
              });
            }}
            background={Colors.red.transparent}
            textColor={Colors.red.main}
            text="Выйти"
          />
        ) : (
          <>
            <Button
              icon={loading ? <Loading width="14px" /> : <FiMessageCircle />}
              onClick={createChat}
              background={Colors.blue.transparent}
              textColor={Colors.blue.main}
              text="Написать"
            />
            {!user?.friends?.find((friend) => friend.user._id === _id) ? (
              <Button
                icon={addLoading ? <Loading width="14px" /> : <FiUserPlus />}
                onClick={addFriendHandle}
                background={Colors.green.transparent}
                textColor={Colors.green.main}
                text="Добавить"
              />
            ) : !!user?.friends?.find(
                (friend) =>
                  friend.user._id === _id && friend.status === "pending"
              ) ? (
              <Button
                icon={addLoading ? <Loading width="14px" /> : <FiUserCheck />}
                onClick={addFriendHandle}
                background={Colors.green.transparent}
                textColor={Colors.green.main}
                text="Принять"
              />
            ) : !!user?.friends?.find(
                (friend) => friend.user._id === _id && friend.status === "added"
              ) ? (
              <Button
                icon={addLoading ? <Loading width="14px" /> : <FiUserMinus />}
                onClick={addFriendHandle}
                background={Colors.red.transparent}
                textColor={Colors.red.main}
                text="Удалить"
              />
            ) : (
              <Button
                icon={addLoading ? <Loading width="14px" /> : <FiMinusCircle />}
                onClick={addFriendHandle}
                background={Colors.pink.transparent}
                textColor={Colors.pink.main}
                text="Отменить"
              />
            )}
          </>
        )}
      </div>
    </UserModalWrapper>
  );
};

export default UserModal;
