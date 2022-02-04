import { contextMenuModel } from "../../../entities/context-menu";

const calcPosition = (
  e: MouseEvent,
  width: number = 265,
  height: number = 200
) => {
  e.preventDefault();
  console.log(height);

  contextMenuModel.events.changePosition({
    position: {
      x: e.clientX < window.innerWidth / 2 ? e.clientX : e.clientX - width,
      y: e.clientY < window.innerHeight / 2 ? e.clientY : e.clientY - height,
    },
  });
};

export default calcPosition;
