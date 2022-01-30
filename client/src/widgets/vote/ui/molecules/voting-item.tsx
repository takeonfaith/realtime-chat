import React from "react";
import styled from "styled-components";
import { FillSpace } from "..";
import { VoteOption } from "../..";
import { userModel } from "../../../../entities/user";
import { RenameField } from "../../../../shared/ui/molecules";

const VotingItemWrapper = styled.div`
  width: 100%;
  min-height: 35px;
  height: 35px;
  border-radius: var(--brLight);
  background: #ffffff28;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  font-size: 0.8em;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  /* transition: 0.2s; */

  .vote-item-name {
    z-index: 2;
  }

  &:hover {
    background: #ffffff68;
  }
`;

interface Props {
  options: VoteOption[];
  setOptions: (options: VoteOption[]) => void;
  option: VoteOption;
  canChange: boolean;
  mode: "single-vote" | "multi-vote";
  index: number;
  isVoted: boolean;
}

const VotingItem = ({
  options,
  setOptions,
  option,
  canChange,
  mode,
  index,
  isVoted,
}: Props) => {
  const {
    data: { user },
  } = userModel.selectors.useUser();

  const handleVote = (index: number) => {
    if (!canChange && !!user) {
      if (!options[index].vouters.find((u) => u._id === user._id)) {
        if (!isVoted && mode === "single-vote") {
          options[index].vouters = [...options[index].vouters, user];
          setOptions([...options]);
        } else if (mode === "multi-vote") {
          options[index].vouters = [...options[index].vouters, user];
          setOptions([...options]);
        }
      } else {
        options[index].vouters = options[index].vouters.filter(
          (u) => u._id !== user._id
        );
        setOptions([...options]);
      }
    }
  };

  return (
    <VotingItemWrapper onClick={() => handleVote(index)}>
      <div className="vote-item-name">
        <RenameField
          value={option.name}
          setValue={(value) => {
            options[index].name = value;
            setOptions([...options]);
          }}
          ableToChange={canChange}
          submit={false}
          background="transparent"
        />
      </div>
      <FillSpace
        percent={
          isVoted
            ? (option.vouters.length /
                options.reduce((acc, o) => {
                  return acc + o.vouters.length;
                }, 0)) *
              100
            : 0
        }
      ></FillSpace>
      {isVoted && <div className="voutes">{option.vouters.length}</div>}
    </VotingItemWrapper>
  );
};

export default VotingItem;
