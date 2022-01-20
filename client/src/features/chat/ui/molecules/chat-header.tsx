import React, { useRef, useState } from "react";
import { FiMoreVertical, FiSearch, FiX } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Attachments } from ".";
import { chatModel } from "../../../../entities/chat";
import { contextMenuModel } from "../../../../entities/context-menu";
import { userModel } from "../../../../entities/user";
import { Button } from "../../../../shared/ui/atoms";
import LocalSearch from "../../../../shared/ui/molecules/local-search";
import useModal from "../../../../widgets/modal";
import User from "../../../../widgets/user";
import getChatName from "../../lib/get-chat-name";
import getOtherUser from "../../lib/get-other-user";

const ChatHeaderWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: var(--schedule);
  box-shadow: 5px 0 5px #00000036;
  position: relative;
  z-index: 2;
`;

const ChatHeader = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchMode, setSearchMode] = useState(false);
  const { open } = useModal();
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const history = useHistory();

  const handleClick = () => {
    if (searchMode) setSearchMode((prev) => !prev);
    else history.push("/chat");
  };

  console.log(selectedChat);

  if (!user?._id) return null;

  return (
    <ChatHeaderWrapper ref={menuRef}>
      <Button
        icon={<FiX />}
        onClick={handleClick}
        background="var(--schedule)"
      />
      {!searchMode ? (
        <User
          avatar={""}
          name={
            selectedChat?.isGroupChat
              ? selectedChat?.chatName
              : getOtherUser(user._id ?? "0", selectedChat?.users ?? []).name
          }
          status={"online"}
          login={getOtherUser(user._id ?? "0", selectedChat?.users ?? []).login}
          _id={
            selectedChat?.isGroupChat
              ? selectedChat._id
              : getOtherUser(user._id ?? "0", selectedChat?.users ?? [])._id
          }
          type={selectedChat?.isGroupChat ? "chat" : "user"}
        />
      ) : (
        <LocalSearch
          searchEngine={() => null}
          setResult={() => null}
          placeholder="Поиск сообщений"
        />
      )}
      <Button
        icon={<FiMoreVertical />}
        onClick={() =>
          contextMenuModel.events.open({
            content: (
              <>
                <Button
                  icon={<FiSearch />}
                  text={"Поиск по сообщениям"}
                  onClick={() => {
                    setSearchMode((prev) => !prev);
                  }}
                  width="100%"
                  align="left"
                  background="transparent"
                />
                <Button
                  icon={<ImAttachment />}
                  text={"Вложения"}
                  onClick={() => open(<Attachments />)}
                  width="100%"
                  align="left"
                  background="transparent"
                />
              </>
            ),
          })
        }
        background="var(--schedule)"
      />
    </ChatHeaderWrapper>
  );
};

export default ChatHeader;
