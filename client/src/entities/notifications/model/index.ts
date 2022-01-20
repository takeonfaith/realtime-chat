import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { Notification } from "../../../shared/api/model";
import { Message } from "../../../shared/api/model/message";

interface NotificationStore {
  notifications: Notification[];
}

const useNotification = () => {
  return { data: useStore($notificationStore) };
};

const pushNotification = createEvent<{ message: Message }>();

const initialState: NotificationStore = {
  notifications: [],
};

const $notificationStore = createStore(initialState).on(
  pushNotification,
  (oldData, newData) => ({
    ...oldData,
    notifications: [...oldData.notifications, newData.message],
  })
);

export const selectors = {
  useNotification,
};

export const events = {
  pushNotification,
};
