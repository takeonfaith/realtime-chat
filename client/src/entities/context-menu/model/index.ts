import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import React from "react";

interface ContextMenuStore {
  open: boolean;
  content: React.ReactNode[] | React.ReactNode | null;
  position: { x: number; y: number };
}

const useContextMenu = () => {
  return useStore($contextMenuStore);
};

const open = createEvent<{
  content: React.ReactNode[] | React.ReactNode;
}>();

const close = createEvent();

const changePosition = createEvent<{ position: { x: number; y: number } }>();

const initialStore: ContextMenuStore = {
  open: false,
  content: null,
  position: { x: 0, y: 0 },
};

const $contextMenuStore = createStore(initialStore)
  .on(open, (oldData, { content }) => ({
    ...oldData,
    open: true,
    content,
  }))
  .on(close, (oldData) => ({
    ...oldData,
    open: false,
  }))
  .on(changePosition, (oldData, { position }) => ({
    ...oldData,
    position,
  }));

export const events = {
  open,
  close,
  changePosition,
};

export const selectors = {
  useContextMenu,
};
