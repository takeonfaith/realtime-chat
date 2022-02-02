import React, { useEffect, useState } from "react";
import { FiBell, FiChevronLeft, FiChevronRight, FiEdit } from "react-icons/fi";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { CHAT_ROUTE } from "../../../../app/routes/routes";
import { chatModel } from "../../../../entities/chat";
import { notificationModel } from "../../../../entities/notifications";
import { userModel } from "../../../../entities/user";
import { Chat, IUser } from "../../../../shared/api/model";
import { Message } from "../../../../shared/api/model/message";
import { Button, Divider, Title } from "../../../../shared/ui/atoms";
import LocalSearch from "../../../../shared/ui/molecules/local-search";
import { useModal, User } from "../../../../widgets";
import { Notifications } from "../../../notifications/ui";
import searchChats from "../../lib/search-chats";
import { ChatItems, CreateGroupModal } from "../molecules";

const ListOfChatsWrapper = styled.div<{ chatId?: string }>`
  padding: 14px;
  min-width: 350px;
  width: 350px;
  transition: 0.2s width, 0.2s min-width, 0.2s padding, 0.2s opacity;
  height: 100%;
  background: var(--list-of-chats);
  color: var(--text);
  margin-left: 70px;
  border-right: 1px solid #00000011;

  .search-and-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
  }

  .chat-list-top-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    button {
      min-width: 30px;
      height: 30px;
      padding: 2px;
      background: transparent;

      svg {
        width: 17px;
        height: 17px;
      }
    }
  }

  .input-wrapper {
    margin-right: 6px;
  }

  @media (max-width: 1000px) {
    width: ${({ chatId }) => (chatId ? "0" : "100%")};
    min-width: ${({ chatId }) => (chatId ? "0" : "100%")};
    padding: ${({ chatId }) => (chatId ? "0" : "14px")};
    opacity: ${({ chatId }) => (chatId ? "0" : "1")};

    .chat-list-top-section {
      button {
        display: none;
      }
    }
  }
`;

const ListOfChats = () => {
  const [foundChats, setFoundChats] = useState<{
    chats: Chat[];
    users: IUser[];
    messages: Message[];
  } | null>(null);
  const {
    data: { user, friendRequests },
  } = userModel.selectors.useUser();
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();
  const params = useRouteMatch(`${CHAT_ROUTE}/:chatId`)?.params as {
    chatId: string | undefined;
  };
  const { open } = useModal();

  const { data, loading } = chatModel.selectors.useChats();

  useEffect(() => {
    if (user?._id) {
      chatModel.effects.getChatsFx(user?._id);
    }
  }, [user?._id]);

  return (
    <ListOfChatsWrapper chatId={params?.chatId}>
      <div className="chat-list-top-section">
        <Title size={3} align="left">
          Чаты
        </Title>
      </div>
      <User
        name={user?.name ?? ""}
        _id={user?._id}
        status={"online"}
        login={user?.login ?? ""}
        actionOnUser={
          <Button
            onClick={(e) => {
              e.stopPropagation();
              open(<Notifications />);
            }}
            icon={<FiBell />}
            background="transparent"
            largeIcon
            notifications={notifications.length + friendRequests.length}
          />
        }
      />
      <div className="search-and-button">
        <LocalSearch
          searchEngine={searchChats}
          setResult={setFoundChats}
          placeholder="Поиск чатов"
        />
        <Button icon={<FiEdit />} onClick={() => open(<CreateGroupModal />)} />
      </div>
      <Divider margin="10px auto" />
      <ChatItems
        chats={foundChats ?? { chats: data.chats, users: [], messages: [] }}
        loading={loading}
      />
    </ListOfChatsWrapper>
  );
};

export default ListOfChats;
