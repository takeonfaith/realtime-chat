import React from "react";
import { FiChevronRight } from "react-icons/fi";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { Notification } from "../../../../shared/api/model";
import getChatName from "../../../chat/lib/get-chat-name";
import { ChatItem } from "../../../chat/ui";

const NotificationItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

const NotificationItem = (props: Notification) => {
  const { chat } = props;
  const {
    data: { user },
  } = userModel.selectors.useUser();

  if (!user) return null;

  return (
    <ChatItem
      latestMessage={chat.latestMessage}
      chat={chat}
      loading={false}
      amountOfUnreadMessages={0}
      addMode={false}
    />
  );
};

export default NotificationItem;
