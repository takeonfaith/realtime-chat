import { chatApi, userApi } from "../../../shared/api";

const searchChats = async (
  userId: string,
  value: string,
  setResult: (params: any) => any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const chats = await chatApi.searchChats(value, userId);
  const users = await userApi.searchUsers(value, userId);
  const messages = await chatApi.searchAllMessages(value, userId);
  setLoading(false);
  setResult({ chats: chats.data, users: users.data, messages: messages.data });
};

export default searchChats;
