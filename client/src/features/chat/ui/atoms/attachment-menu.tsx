import React from "react";
import { FiImage } from "react-icons/fi";
import { HiOutlineChartSquareBar } from "react-icons/hi";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { Button } from "../../../../shared/ui/atoms";
import { useModal, Vote } from "../../../../widgets";

const AttachmentMenuWrapper = styled.div``;

const AttachmentMenu = () => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const { open } = useModal();
  return (
    <AttachmentMenuWrapper>
      <Button
        icon={<HiOutlineChartSquareBar />}
        onClick={() =>
          open(<Vote mode={"multi-vote"} creator={user} title="Кто гей" />)
        }
        text="Голосование"
        background="transparent"
      />
      <Button
        icon={<FiImage />}
        onClick={() => null}
        text="Изображение"
        background="transparent"
      />
    </AttachmentMenuWrapper>
  );
};

export default AttachmentMenu;
