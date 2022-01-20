import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { userModel } from "../../entities/user";
import { CHAT_ROUTE, LOGIN_ROUTE, privateRoutes, publicRoutes } from "./routes";

const Router = () => {
  const {
    data: { isAuthenticated },
  } = userModel.selectors.useUser();

  return isAuthenticated ? (
    <>
      <Switch>
        {privateRoutes.map(({ path, Component }) => {
          return (
            <Route path={path} key={path}>
              {Component}
            </Route>
          );
        })}
      </Switch>
      <Redirect to={CHAT_ROUTE} />
    </>
  ) : (
    <Switch>
      {publicRoutes.map(({ path, Component }, i) => {
        return (
          <Route path={path} key={path}>
            {Component}
          </Route>
        );
      })}
      <Redirect to={LOGIN_ROUTE} />
    </Switch>
  );
};

export default Router;
