import React from "react";
import { HashRouter } from "react-router-dom";
import styled from "styled-components";
import { Confirm, ContextMenu } from "../widgets";
import { Modal } from "../widgets/modal";
import { ModalProvider } from "../widgets/modal/lib";
import Router from "./routes/router";

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <AppWrapper>
      <ModalProvider>
        <HashRouter basename="/">
          <Modal />
          <ContextMenu />
          <Confirm />
          <Router />
        </HashRouter>
      </ModalProvider>
    </AppWrapper>
  );
};

export default App;
