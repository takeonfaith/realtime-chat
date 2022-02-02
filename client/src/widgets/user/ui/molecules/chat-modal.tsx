import React, { useMemo, useState } from "react";
import { FiChevronRight, FiLogOut, FiUserPlus, FiX } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import User from "../..";
import { useModal } from "../../..";
import { chatModel } from "../../../../entities/chat";
import { confirmModel } from "../../../../entities/confirm";
import { userModel } from "../../../../entities/user";
import { AddToGroupModal, Attachments } from "../../../../features/chat/ui";
import ErrorMessage from "../../../../pages/login/ui/atoms/error-message";
import { chatApi } from "../../../../shared/api";
import { Colors } from "../../../../shared/consts";
import {
  Button,
  Divider,
  Loading,
  SkeletonShape,
  Title,
} from "../../../../shared/ui/atoms";
import { Avatar, RenameField } from "../../../../shared/ui/molecules";

const ChatModalWrapper = styled.div`
  width: 350px;
  height: 450px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  overflow-x: hidden;

  .chat-name {
    margin: 10px 0;
  }

  .users-list {
    width: 100%;
    margin-bottom: 10px;
    min-height: fit-content;
  }

  .user {
    width: 100%;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    & > * + * {
      margin-left: 5px;
    }
  }

  .section {
    width: 100%;
    margin: 5px 0;

    h5 {
      margin-bottom: 5px;
    }
  }

  .attachments {
    display: flex;

    & > * + * {
      margin-left: 6px;
    }
  }
`;

const ChatModal = () => {
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const { open, close } = useModal();
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState(selectedChat?.chatName);
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameCompleted, setRenameCompleted] = useState(false);
  const [renameError, setRenameError] = useState("");
  const history = useHistory();
  const isGroupAdmin = useMemo(
    () =>
      !!selectedChat?.groupAdmin && selectedChat?.groupAdmin._id === user?._id,
    [selectedChat?._id]
  );

  if (!selectedChat || !selectedChat.groupAdmin || !user) return null;

  const removeHandle = async (userId: string) => {
    try {
      setLoading(true);
      const { data } = await chatApi.removeFromGroup(selectedChat._id, userId);
      setLoading(false);
      setRenameCompleted(true);
      if (userId === user?._id) {
        history.push("/chat");
        chatModel.effects.getChatsFx(user._id);
        close();
      } else {
        chatModel.events.changeSelectedChat({ chat: data });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const renameHandle = async () => {
    try {
      if (chatName) {
        setRenameLoading(true);
        const { data } = await chatApi.renameGroup(selectedChat._id, chatName);
        setRenameLoading(false);
        chatModel.events.changeSelectedChat({ chat: data });
        chatModel.effects.getChatsFx(user._id);
      }
    } catch (error) {
      setRenameLoading(true);
      setRenameError("Не удалось переименовать чат");
    }
  };

  if (!user) return null;

  return (
    <ChatModalWrapper>
      <Avatar type="chat" width="120px" height="120px" marginRight="0" />
      <ErrorMessage message={renameError} />
      <div className="chat-name">
        <RenameField
          ableToChange={isGroupAdmin}
          value={chatName ?? ""}
          setValue={setChatName}
          placeholder="Введите название беседы"
          action={renameHandle}
          loading={renameLoading}
          completed={renameCompleted}
          setCompleted={setRenameCompleted}
          isActive={
            !!chatName &&
            chatName.length !== 0 &&
            selectedChat.chatName !== chatName
          }
        />
      </div>

      <div className="buttons">
        {isGroupAdmin && (
          <>
            <Button
              icon={<FiUserPlus />}
              onClick={() =>
                open(
                  <AddToGroupModal
                    chatId={selectedChat._id}
                    users={selectedChat.users}
                  />
                )
              }
              background={Colors.green.transparent}
              textColor={Colors.green.main}
              text="Добавить"
            />
          </>
        )}
        <Button
          icon={<FiLogOut />}
          onClick={() => removeHandle(user?._id)}
          background={Colors.red.transparent}
          textColor={Colors.red.main}
          text="Покинуть"
        />
      </div>
      <div className="section" onClick={() => open(<Attachments />)}>
        <Title size={5} align="left">
          Вложения
          <FiChevronRight />
        </Title>
        <div className="attachments">
          <SkeletonShape
            shape={"rect"}
            size={{
              width: "80px",
              height: "80px",
            }}
            margin="0"
          />
          <SkeletonShape
            shape={"rect"}
            size={{
              width: "80px",
              height: "80px",
            }}
            margin="0"
          />
          <SkeletonShape
            shape={"rect"}
            size={{
              width: "80px",
              height: "80px",
            }}
            margin="0"
          />
          <SkeletonShape
            shape={"rect"}
            size={{
              width: "80px",
              height: "80px",
            }}
            margin="0"
          />
        </div>
      </div>
      <Divider />
      <div className="section">
        <Title size={5} align="left">
          Администратор
        </Title>
        <User {...selectedChat.groupAdmin} status="online" />
      </div>
      <div className="section">
        <Title size={5} align="left">
          Участники
        </Title>
        <div className="users-list">
          {selectedChat?.users.map((u) => {
            return (
              <User
                {...u}
                status="online"
                key={u._id}
                actionOnUser={
                  isGroupAdmin &&
                  user &&
                  u._id !== user._id && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        !loading &&
                          confirmModel.events.evokeConfirm({
                            message: `Вы уверены, что хотите удалить ${u.name} из беседы?`,
                            onConfirm: () => removeHandle(u._id),
                          });
                      }}
                      icon={!loading ? <FiX /> : <Loading width="10px" />}
                      background="transparent"
                    />
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </ChatModalWrapper>
  );
};

export default ChatModal;
