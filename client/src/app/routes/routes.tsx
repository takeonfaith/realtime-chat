import ChatPage from "../../pages/chat";
import LoginPage from "../../pages/login";
import SignUpPage from "../../pages/signup";

export const CHAT_ROUTE = "/chat";
export const LOGIN_ROUTE = "/login";
export const SIGNUP_ROUTE = "/signup";

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: <LoginPage />,
  },
  {
    path: SIGNUP_ROUTE,
    Component: <SignUpPage />,
  },
];

export interface IRoute {
  path: string;
  Component: JSX.Element;
}

export const privateRoutes = [
  {
    path: CHAT_ROUTE,
    Component: <ChatPage />,
  },
];
