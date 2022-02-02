import React from "react";
import styled from "styled-components";
import SearchMessages from "../../../search-messages";

const SearchChatMessagesWrapper = styled.div`
  width: 400px;
  height: 450px;
`;

const SearchChatMessages = () => {
  return (
    <SearchChatMessagesWrapper>
      <SearchMessages />
    </SearchChatMessagesWrapper>
  );
};

export default SearchChatMessages;
