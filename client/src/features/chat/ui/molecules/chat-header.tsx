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
import getOtherUser from "../../lib/get-other-user";
import searchChatMessages from "../../lib/search-chat-messages";

const ChatHeaderWrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  background: var(--list-of-chats);
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

  if (!user?._id) return null;

  return (
    <ChatHeaderWrapper ref={menuRef}>
      <Button icon={<FiX />} onClick={handleClick} background="transparent" />
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
          searchEngine={(
            _: string,
            value: string,
            setResult: (params: any) => void
          ) => searchChatMessages(selectedChat?._id ?? "", value, setResult)}
          setResult={(messages: any) => console.log(messages)}
          placeholder="Поиск сообщений"
        />
      )}
      <Button
        icon={<FiMoreVertical />}
        background="transparent"
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
      />
    </ChatHeaderWrapper>
  );
};

export default ChatHeader;
