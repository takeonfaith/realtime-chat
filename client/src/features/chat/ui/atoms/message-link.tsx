import React from "react";
import styled from "styled-components";
import { confirmModel } from "../../../../entities/confirm";
import { IUser } from "../../../../shared/api/model";
import { useModal } from "../../../../widgets";
import { UserModal } from "../../../../widgets/user/ui/molecules";

const MessageLinkItemWrapper = styled.span<{ isYourMessage: boolean }>`
  color: ${({ isYourMessage }) =>
    isYourMessage ? "#b4d4ff" : "var(--reallyBlue)"};
  font-weight: 500;
  cursor: pointer;
`;

interface Props {
  text: string;
  isYourMessage: boolean;
  user?: IUser;
  isRealLink?: boolean;
}

const MessageLinkItem = ({
  text,
  isYourMessage,
  user,
  isRealLink = false,
}: Props) => {
  const { open } = useModal();

  const handleClick = () => {
    if (!!user) open(<UserModal {...user} status="online" />);
    else if (isRealLink) {
      confirmModel.events.evokeConfirm({
        message: "Вы точно хотите перейти по ссылке?" + text,
        onConfirm: () => (window.location.href = text),
      });
    }
  };
  return (
    <MessageLinkItemWrapper isYourMessage={isYourMessage} onClick={handleClick}>
      {" " + text}
    </MessageLinkItemWrapper>
  );
};

export default MessageLinkItem;
