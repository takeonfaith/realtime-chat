import axios from "axios";
import { createEffect, createEvent, createStore, forward } from "effector";
import { useStore } from "effector-react";
import { userApi } from "../../../shared/api";
import { IUser, UserToken } from "../../../shared/api/model";
import { LoginData, SignUpData } from "../../../shared/api/user-api";

interface UserStore {
  currentUser: IUser | null;
  isAuthenticated: boolean | null;
  error: string | null;
  addedFriends: IUser[] | null;
  friendRequests: {
    user: { _id: string; name: string; login: string };
    status: string;
  }[];
}

const getUserTokenFx = createEffect<LoginData, UserToken>(
  async (params: LoginData) => {
    try {
      const tokenResponse = await userApi.getUserToken(params);

      const form = new FormData();
      form.set("login", params.login);
      form.set("password", params.password);
      form.set("auth_action", "userlogin");

      // set old version site cookies
      try {
        await axios.post("/user/api/login", form);
      } catch {}

      localStorage.setItem("token", JSON.stringify(tokenResponse.data));

      return tokenResponse.data;
    } catch (e) {
      throw new Error("Неверный логин или пароль");
    }
  }
);

const getUserFx = createEffect<UserToken, UserStore>(
  async ({ token }: UserToken): Promise<UserStore> => {
    try {
      const { data } = await userApi.getUser(token);

      return {
        currentUser: data,
        isAuthenticated: !!data,
        error: "",
        addedFriends:
          data?.friends?.reduce((acc, friend) => {
            if (friend.status === "added") acc.push(friend.user);
            return acc;
          }, [] as IUser[]) ?? [],
        friendRequests:
          data?.friends?.filter((friend) => friend.status === "pending") ?? [],
      };
    } catch (error) {
      logout();
      throw new Error("token expired");
    }
  }
);

const signUpFx = createEffect<SignUpData, UserStore>(
  async ({ name, login, password }: SignUpData): Promise<UserStore> => {
    try {
      const { data } = await userApi.signUp({
        name,
        login,
        password,
      });

      localStorage.setItem("token", JSON.stringify({ token: data.token }));

      return {
        currentUser: data,
        isAuthenticated: true,
        error: null,
        addedFriends: [],
        friendRequests: [],
      };
    } catch (error) {
      throw new Error("Не удалось зарегистрироваться");
    }
  }
);

const loginFx = createEffect<LoginData, UserStore>(
  async ({ login, password }: LoginData): Promise<UserStore> => {
    try {
      const { data } = await userApi.login({ login, password });

      localStorage.setItem("token", JSON.stringify({ token: data.token }));
      return {
        currentUser: data,
        isAuthenticated: true,
        error: null,
        addedFriends:
          data?.friends?.reduce((acc, friend) => {
            if (friend.status === "added") acc.push(friend.user);
            return acc;
          }, [] as IUser[]) ?? [],
        friendRequests:
          data?.friends?.filter((friend) => friend.status === "pending") ?? [],
      };
    } catch (error) {
      throw new Error("Не удалось войти");
    }
  }
);

const useUser = () => {
  const {
    currentUser: user,
    error,
    isAuthenticated,
    friendRequests,
    addedFriends,
  } = useStore($userStore);
  return {
    data: {
      user,
      isAuthenticated: isAuthenticated,
      friendRequests,
      addedFriends,
    },
    loading: {
      login: useStore(loginFx.pending),
      signup: useStore(signUpFx.pending),
    },
    error: error,
  };
};

const logoutFx = createEffect(() => {
  localStorage.removeItem("token");
});

const login = createEvent<LoginData>();
const signUp = createEvent<SignUpData>();
const logout = createEvent();
const addFriend = createEvent<{ friend: IUser }>();

forward({ from: login, to: loginFx });
forward({ from: logout, to: logoutFx });
forward({ from: signUp, to: signUpFx });

//  In effector chat core-team describe something like this code (Perhaps a better solution can be found)
// TODO: ask about token expires (Looks like it won't expire)
const tokenInStorage = JSON.parse(localStorage.getItem("token") ?? "null");

!!tokenInStorage && getUserFx(tokenInStorage);

const initialStore: UserStore = {
  currentUser: null,
  error: null,
  isAuthenticated: !!tokenInStorage,
  friendRequests: [],
  addedFriends: null,
};

const $userStore = createStore<UserStore>(initialStore)
  .on(signUpFx.doneData, (oldData, newData) => ({
    ...newData,
  }))
  .on(loginFx.doneData, (oldData, newData) => ({
    ...newData,
  }))
  .on(getUserFx.doneData, (_, newData) => newData)
  .on(loginFx.failData, (_, newData) => ({
    error: newData.message,
    currentUser: null,
    isAuthenticated: null,
    friendRequests: [],
    addedFriends: [],
  }))
  .on(getUserTokenFx.failData, (_, error) => ({
    isAuthenticated: null,
    currentUser: null,
    error: error.message,
    friendRequests: [],
    addedFriends: [],
  }))
  .on(logout, () => ({
    error: "",
    isAuthenticated: null,
    currentUser: null,
    friendRequests: [],
    addedFriends: [],
  }))
  .on(addFriend, (oldData, newData) => ({
    ...oldData,
    currentUser: oldData.currentUser
      ? {
          ...oldData.currentUser,
          friends: [
            ...(oldData.currentUser.friends ?? []),
            { user: newData.friend, status: "requested" },
          ],
        }
      : null,
  }));

export const selectors = {
  useUser,
};

export const events = {
  login,
  logout,
  signUp,
  addFriend,
};

export const effects = {
  getUserFx,
};
