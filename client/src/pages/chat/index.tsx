import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { CHAT_ROUTE } from "../../app/routes/routes";
import { ChatWindow, EmptyHere, ListOfChats } from "../../features/chat/ui";

const ChatPageWrapper = styled.div`
  display: flex;
  width: 80%;
  height: 90vh;
  box-shadow: 0 0 300px #00000018;
  border-radius: 12px;
  overflow: hidden;
  background: var(--theme-transparent-opposite);
  backdrop-filter: blur(150px);

  @media (max-width: 1300px) {
    width: 100%;
    height: 100vh;
    border-radius: 0px;
  }
`;

const ChatPage = () => {
  const params = useRouteMatch(CHAT_ROUTE + "/:chatId")?.params as {
    chatId: string | undefined;
  };

  return (
    <ChatPageWrapper>
      <ListOfChats />
      {!params?.chatId && <EmptyHere />}
      <Switch>
        <Route path={"/chat/:chatId"}>
          <ChatWindow />
        </Route>
      </Switch>
    </ChatPageWrapper>
  );
};

export default ChatPage;
