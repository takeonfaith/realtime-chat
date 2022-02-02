import { AxiosResponse } from "axios";
import normalizeString from "../lib/normalize-string";
import { $api } from "./config";
import { IUser, UserToken } from "./model";

export type LoginData = { login: string; password: string };
export type SignUpData = {
  name: string;
  login: string;
  password: string;
};

export const getUserToken = ({ login, password }: LoginData) => {
  return $api.post<UserToken>("api/user/login", {
    login,
    password,
  });
};

export const getUser = (token: string): Promise<AxiosResponse<IUser, any>> => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.get<IUser>("/api/user/getUser", config);
};

export const login = ({
  login,
  password,
}: LoginData): Promise<AxiosResponse<IUser, any>> => {
  return $api.post<IUser>("/api/user/login", {
    login,
    password,
  });
};

export const signUp = (
  props: SignUpData
): Promise<AxiosResponse<IUser, any>> => {
  const { name, login, password } = props;

  return $api.post<IUser>("/api/user/", {
    name,
    login,
    password,
  });
};

export const searchUsers = (value: string, userId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    user: { _id: userId },
  };

  return $api.get<IUser[]>(
    `/api/user?search=${normalizeString(value)}`,
    config
  );
};

export const addFriend = (friendId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.post<IUser[]>(`/api/user/addFriend`, { friendId }, config);
};

export const acceptFriend = (friendId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.post<IUser[]>(`/api/user/acceptFriend`, { friendId }, config);
};

export const rejectFriend = (friendId: string) => {
  const { token } = JSON.parse(localStorage.getItem("token") ?? "null");
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.post<IUser[]>(`/api/user/rejectFriend`, { friendId }, config);
};
