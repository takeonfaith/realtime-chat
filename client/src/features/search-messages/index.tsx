import React, { useState } from "react";
import styled from "styled-components";
import { chatModel } from "../../entities/chat";
import { Message } from "../../shared/api/model";
import { Title } from "../../shared/ui/atoms";
import LocalSearch from "../../shared/ui/molecules/local-search";
import searchChatMessages from "./lib/search-chat-messages";
import { FoundMessage } from "./ui";

const SearchMessagesWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .message-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 5px 0;
  }
`;

const SearchMessages = () => {
  const {
    data: { selectedChat },
  } = chatModel.selectors.useChats();

  const [foundMessages, setFoundMessages] = useState<Message[] | null>([]);

  return (
    <SearchMessagesWrapper>
      <Title size={3} bottomGap align="left">
        Поиск сообщений
      </Title>
      <LocalSearch
        searchEngine={(
          _: string,
          value: string,
          setResult: (params: any) => void,
          setLoading: React.Dispatch<React.SetStateAction<boolean>>
        ) =>
          searchChatMessages(
            selectedChat?._id ?? "",
            value,
            setResult,
            setLoading
          )
        }
        setResult={setFoundMessages}
        placeholder="Поиск сообщений"
      />
      <div className="message-list">
        {foundMessages?.map((message) => {
          return <FoundMessage message={message} />;
        })}
      </div>
    </SearchMessagesWrapper>
  );
};

export default SearchMessages;
