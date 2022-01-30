import React from "react";
import styled from "styled-components";
import { useModal } from "../../..";
import { Avatar } from "../../../../shared/ui/molecules";
import { ChatModal, UserModal } from "../molecules";
import { User as IUser } from "../../../../shared/api/model/user";
import { Checkbox } from "../../../../shared/ui/atoms";

const UserWrapper = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: var(--brLight);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  background: ${({ selected }) => selected && "var(--blue)"};
  color: ${({ selected }) => selected && "#fff"};
  position: relative;

  .user-checkbox {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 2;
  }

  .user-inner {
    display: flex;
    align-items: center;
  }

  &:hover {
    background: var(--mild-hover-bg);
  }

  .name-and-status {
    display: flex;
    flex-direction: column;

    .name {
      font-size: 0.85em;
    }

    .status {
      font-size: 0.7em;
      opacity: 0.6;
    }
  }
`;

interface Props {
  avatar?: string;
  name: string;
  _id?: string;
  status: "online" | "offline";
  login: string;
  type: "chat" | "user";
  added?: boolean;
  setAdded?: any;
  actionOnUser?: React.ReactNode;
  selected?: boolean;
}

const LoadedUser = ({
  avatar,
  name,
  _id,
  login,
  status,
  type,
  added,
  setAdded,
  actionOnUser,
  selected,
}: Props) => {
  const { open } = useModal();

  const handleAdd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (added) {
      setAdded((prev: IUser[]) => prev.filter((user) => user._id !== _id));
    } else {
      setAdded((prev: IUser[]) => [
        ...prev,
        {
          avatar,
          name,
          _id,
          login,
          type,
        },
      ]);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!setAdded) {
      open(
        type === "user" ? (
          <UserModal
            avatar={avatar}
            name={name}
            _id={_id}
            status={status}
            login={login}
          />
        ) : (
          <ChatModal />
        )
      );
    } else {
      handleAdd(e);
    }
  };

  return (
    <UserWrapper
      className="user"
      selected={selected ?? false}
      onClick={handleClick}
    >
      <div className="user-inner">
        {!!setAdded && (
          <div className="user-checkbox">
            <Checkbox
              checked={added ?? false}
              setChecked={handleAdd}
              invisibleOnFalse
            />
          </div>
        )}
        <Avatar avatar={avatar} width="30px" height="30px" marginRight="7px" />
        <div className="name-and-status">
          <span className="name">{name}</span>
          <span className="status">{status}</span>
        </div>
      </div>
      {actionOnUser}
    </UserWrapper>
  );
};

export default LoadedUser;
