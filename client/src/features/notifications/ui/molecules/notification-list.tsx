import React from "react";
import styled from "styled-components";
import { NotificationItem } from "..";
import { notificationModel } from "../../../../entities/notifications";
import { EmptyHere } from "../../../chat/ui";

const NotificationListWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const NotificationList = () => {
  const {
    data: { notifications },
  } = notificationModel.selectors.useNotification();
  return (
    <NotificationListWrapper>
      {!notifications.length && <EmptyHere message="Нет новых уведомлений" />}
      {notifications.map((notification) => {
        return <NotificationItem {...notification} />;
      })}
    </NotificationListWrapper>
  );
};

export default NotificationList;
