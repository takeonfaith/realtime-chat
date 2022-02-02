import { IUser } from "../../../shared/api/model";

const getChatName = (userId?: string, users?: IUser[]) => {
  if (!users?.length || !userId) return "";

  return users.filter((user) => user._id !== userId)[0].name;
};

export default getChatName;
