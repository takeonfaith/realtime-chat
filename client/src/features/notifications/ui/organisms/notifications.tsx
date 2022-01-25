import React from "react";
import styled from "styled-components";
import { FriendRequest, NotificationList } from "..";
import { notificationModel } from "../../../../entities/notifications";
import { Title } from "../../../../shared/ui/atoms";

const NotificationsWrapper = styled.div`
  @media (min-width: 1001px) {
    width: 350px;
    height: 350px;
  }

  display: flex;
  flex-direction: column;
`;

const Notifications = () => {
  return (
    <NotificationsWrapper>
      <Title size={3} align="left" bottomGap>
        Уведомления
      </Title>
      <FriendRequest />
      <NotificationList />
    </NotificationsWrapper>
  );
};

export default Notifications;
