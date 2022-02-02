import React, { useRef } from "react";
import { FiCornerUpLeft, FiMoreVertical, FiSearch, FiX } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Attachments, HeaderPinnedMessage, SearchChatMessages } from ".";
import { chatModel } from "../../../../entities/chat";
import { contextMenuModel } from "../../../../entities/context-menu";
import { userModel } from "../../../../entities/user";
import { Colors } from "../../../../shared/consts";
import { Button } from "../../../../shared/ui/atoms";
import useModal from "../../../../widgets/modal";
import User from "../../../../widgets/user";
import getOtherUser from "../../lib/get-other-user";
import ShareMessage from "./share-message";

const ChatHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--list-of-chats);
  position: relative;
  z-index: 2;

  .header-content {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
  }

  .buttons {
    display: flex;
    align-items: center;

    & > * + * {
      margin-left: 10px;
    }
  }
`;

const ChatHeader = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { open } = useModal();
  const {
    data: { selectedChat, selectedMessages },
  } = chatModel.selectors.useChats();
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const history = useHistory();

  const handleClick = () => {
    history.push("/chat");
  };

  if (!user?._id) return null;

  return (
    <ChatHeaderWrapper ref={menuRef}>
      <div className="header-content">
        {!selectedMessages.length ? (
          <>
            <Button
              icon={<FiX />}
              onClick={handleClick}
              background="transparent"
            />
            <User
              avatar={""}
              name={
                selectedChat?.isGroupChat
                  ? selectedChat?.chatName
                  : getOtherUser(user._id ?? "0", selectedChat?.users ?? [])
                      .name
              }
              status={"online"}
              login={
                getOtherUser(user._id ?? "0", selectedChat?.users ?? []).login
              }
              _id={
                selectedChat?.isGroupChat
                  ? selectedChat._id
                  : getOtherUser(user._id ?? "0", selectedChat?.users ?? [])._id
              }
              type={selectedChat?.isGroupChat ? "chat" : "user"}
            />
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
                          open(<SearchChatMessages />);
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
          </>
        ) : (
          <>
            <div className="buttons">
              <Button
                onClick={() =>
                  open(<ShareMessage messages={selectedMessages} />)
                }
                icon={<FiCornerUpLeft />}
                text="Переслать"
                background={Colors.blue.transparent}
                textColor={Colors.blue.main}
              />
              <Button
                onClick={() =>
                  open(<ShareMessage messages={selectedMessages} />)
                }
                icon={<FiX />}
                text="Удалить"
                background={Colors.red.transparent}
                textColor={Colors.red.main}
              />
            </div>
            <Button
              onClick={() => chatModel.events.clearAllselectedMessage()}
              icon={<FiX />}
              text="Отменить"
            />
          </>
        )}
      </div>
      <HeaderPinnedMessage
        showPinnedMessage={!!selectedChat?.pinnedMessages?.length}
      />
    </ChatHeaderWrapper>
  );
};

export default ChatHeader;
