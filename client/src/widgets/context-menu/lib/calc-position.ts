import { contextMenuModel } from "../../../entities/context-menu";

const calcPosition = (e: MouseEvent) => {
  e.preventDefault();
  contextMenuModel.events.changePosition({
    position: {
      x: e.clientX < window.innerWidth / 2 ? e.clientX : e.clientX - 265,
      y: e.clientY < window.innerHeight / 2 ? e.clientY : e.clientY - 200,
    },
  });
};

export default calcPosition;
