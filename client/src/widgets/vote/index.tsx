import React, { useState } from "react";
import { FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { HiOutlinePencil, HiOutlineXCircle } from "react-icons/hi";
import styled from "styled-components";
import { useModal, User } from "..";
import { userModel } from "../../entities/user";
import { User as IUser } from "../../shared/api/model";
import { Button, Title } from "../../shared/ui/atoms";
import { Avatar, RenameField } from "../../shared/ui/molecules";
import { UserModal } from "../user/ui/molecules";
import { UserList, VotingItem } from "./ui";

const VotingFieldWrapper = styled.div`
  width: 100%;
  min-width: 350px;
  max-width: 400px;
  color: #fff;
  background: linear-gradient(45deg, #4d3de0, #324bd8);
  padding: 15px;
  border-radius: var(--brLight);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  .info {
    font-size: 0.7em;
    opacity: 0.7;
    font-weight: 600;
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .creator {
    margin: 0px 0 30px 0;
    font-size: 0.8em;
    opacity: 0.8;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .edit-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .voting-name {
    margin: 50px 0 15px 0;
    display: flex;
    justify-content: center;
  }

  .votes {
    font-weight: bold;
    z-index: 10;
  }

  .voting-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    max-height: 200px;
    overflow: auto;

    & > * + * {
      margin-top: 5px;
    }
  }

  .users {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 5px 10px;
    border-radius: var(--brLight);
    width: fit-content;

    &:hover {
      background: #ffffff58;
    }

    .user-list {
      display: flex;
      align-items: center;
      justify-content: center;

      & > * {
        border: 3px solid #4640de;
      }

      & > * + * {
        margin-left: -5px;
      }
    }
  }
`;

export interface VoteOption {
  name: string;
  vouters: IUser[];
}

interface Props {
  title: string;
  mode: "single-vote" | "multi-vote";
  creator: IUser | null;
}

const VotingField = ({ mode, creator, title = "Голосование" }: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const { open } = useModal();
  const [name, setName] = useState(title);
  const [options, setOptions] = useState<VoteOption[]>([
    {
      name: "Тест",
      vouters: [
        { _id: "1", login: "e", name: "ew", friends: [] },
        { _id: "2", login: "e", name: "ew", friends: [] },
        { _id: "3", login: "e", name: "ew", friends: [] },
        { _id: "4", login: "e", name: "ew", friends: [] },
      ],
    },
    { name: "Тест1", vouters: [] },
    { name: "Тест2", vouters: [] },
    {
      name: "Тест3",
      vouters: [
        { _id: "41", login: "e", name: "ew", friends: [] },
        { _id: "21", login: "e", name: "ew", friends: [] },
        { _id: "33", login: "e", name: "ew", friends: [] },
        { _id: "43", login: "e", name: "ew", friends: [] },
        { _id: "5", login: "e", name: "ew", friends: [] },
        { _id: "6", login: "e", name: "ew", friends: [] },
        { _id: "7", login: "e", name: "ew", friends: [] },
        { _id: "8", login: "e", name: "ew", friends: [] },
      ],
    },
  ]);
  const isCreator = user?._id === creator?._id;
  const [editMode, setEditMode] = useState(false);
  const isVoted = !!options.find(
    (option) => !!option.vouters.find((u) => u._id === user?._id)
  );

  return (
    <VotingFieldWrapper>
      <div className="info">
        {mode === "single-vote" ? "Одиночный" : "Множественный"}
      </div>
      {isCreator && (
        <div className="edit-button">
          <Button
            icon={<HiOutlinePencil />}
            onClick={() => setEditMode((prev) => !prev)}
            background="transparent"
            textColor="#fff"
          />
        </div>
      )}
      <div className="voting-name">
        <RenameField
          value={name}
          setValue={setName}
          action={function (): void {
            throw new Error("Function not implemented.");
          }}
          loading={false}
          completed={false}
          setCompleted={function (completed: boolean): void {
            throw new Error("Function not implemented.");
          }}
          isActive={false}
          ableToChange={editMode}
        />
      </div>

      {creator && (
        <div
          className="creator"
          onClick={() => open(<UserModal {...creator} status="online" />)}
        >
          {creator.name}
        </div>
      )}

      {editMode && (
        <Button
          icon={<FiPlusCircle />}
          text="Добавить"
          onClick={() =>
            setOptions((prev) => [
              ...prev,
              { name: "Название", voutes: 0, vouters: [] },
            ])
          }
          background="transparent"
          textColor="#fff"
          width="100%"
          align="left"
        />
      )}
      {isVoted && (
        <Button
          onClick={() => {
            const temp = options.map((option) => {
              return {
                ...option,
                vouters: option.vouters.filter((u) => u._id !== user?._id),
              };
            });
            setOptions([...temp]);
          }}
          icon={<HiOutlineXCircle />}
          text="Отменить выбор"
          background="transparent"
          textColor="#fff"
          align="left"
          width="100%"
        />
      )}
      <div className="voting-list">
        {options.map((option, i) => {
          return (
            <VotingItem
              options={options}
              setOptions={setOptions}
              option={option}
              canChange={editMode}
              mode={mode}
              index={i}
              isVoted={isVoted}
            />
          );
        })}
      </div>
      <div
        className="users"
        onClick={() =>
          open(
            <UserList
              users={options.reduce((acc, option) => {
                option.vouters.forEach((u) => acc.push(u));
                return acc;
              }, [] as IUser[])}
            />
          )
        }
      >
        <Title size={5} bottomGap>
          <>
            Участники <FiChevronRight />
          </>
        </Title>
        <div className="user-list">
          {options.slice(0, 3).map((option) => {
            return (
              <Avatar
                width="23px"
                height="23px"
                marginRight="0"
                background="#ffffff49"
              />
            );
          })}
        </div>
      </div>
    </VotingFieldWrapper>
  );
};

export default VotingField;
