export interface IUser {
  _id: string;
  login: string;
  name: string;
  token?: string;
  friends?: {
    user: { _id: string; name: string; login: string };
    status: string;
  }[];
}
