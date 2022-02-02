import { IUser } from "../../../shared/api/model";

const getOtherUser = (userId: string, users: IUser[]) => {
  return users.filter((user) => user._id !== userId)[0];
};

export default getOtherUser;
