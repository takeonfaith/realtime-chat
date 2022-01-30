import React, { useState } from "react";
import { FiUserCheck, FiUsers } from "react-icons/fi";
import styled from "styled-components";
import { userModel } from "../../../../entities/user";
import { Chat, User as IUser } from "../../../../shared/api/model";
import { Avatar } from "../../../../shared/ui/molecules";

const ListOfFriendsWrapper = styled.div`
  width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: var(--mild-hover-bg);
  position: absolute;
  z-index: 2;
  transition: 0.2s;
  overflow: hidden;
  padding: 20px 0;

  .icon {
    width: 20px;
    height: 20px;
  }

  .friends-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;

    & > * + * {
      margin-top: 12px;
    }
  }

  .user .name-and-status {
    display: none;
  }

  /* &:hover {
    width: 300px;
    background: var(--theme);
    box-shadow: 0 0 30px #0000005a;
    padding: 10px;

    .user {
      width: 100%;
    }

    .user .name-and-status {
      display: flex;
    }
  } */
`;

const ListOfFriends = () => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <ListOfFriendsWrapper>
      <div className="friends-list">
        <FiUsers className="icon" />
        {/* {!friends.length && <b>Вы не добавили друзей</b>} */}
        {user?.friends
          ?.filter((friend) => friend.status === "added")
          ?.map((friend) => {
            return (
              <Avatar
                width="40px"
                height="40px"
                marginRight="0"
                key={friend.user._id}
              />
            );
          })}
      </div>
    </ListOfFriendsWrapper>
  );
};

export default ListOfFriends;
