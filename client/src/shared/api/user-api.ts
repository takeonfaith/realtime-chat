import { AxiosResponse } from "axios";
import normalizeString from "../lib/normalize-string";
import { $api } from "./config";
import { User, UserToken } from "./model";

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

export const getUser = (token: string): Promise<AxiosResponse<User, any>> => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return $api.get<User>("/api/user/getUser", config);
};

export const login = ({
  login,
  password,
}: LoginData): Promise<AxiosResponse<User, any>> => {
  return $api.post<User>("/api/user/login", {
    login,
    password,
  });
};

export const signUp = (
  props: SignUpData
): Promise<AxiosResponse<User, any>> => {
  const { name, login, password } = props;

  return $api.post<User>("/api/user/", {
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

  return $api.get<User[]>(`/api/user?search=${normalizeString(value)}`, config);
};
