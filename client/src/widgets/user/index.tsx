import React from "react";
import { User as IUser } from "../../shared/api/model/user";
import { SkeletonLoading } from "./ui";
import { LoadedUser } from "./ui/organisms";

interface Props {
  avatar?: string;
  name: string;
  _id?: string;
  status: "online" | "offline";
  login?: string;
  type?: "chat" | "user";
  added?: boolean;
  setAdded?: React.Dispatch<React.SetStateAction<IUser[]>>;
  actionOnUser?: React.ReactNode;
}

const User = (props: Props) => {
  return !!props._id && props.login ? (
    <LoadedUser {...props} type={props.type ?? "user"} login={props.login} />
  ) : (
    <SkeletonLoading />
  );
};

export default User;
