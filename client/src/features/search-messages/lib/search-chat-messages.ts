import { chatApi } from "../../../shared/api";

const searchChatMessages = async (
  chatId: string,
  value: string,
  setResult: (params: any) => any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const { data } = await chatApi.searchChatMessages(chatId, value);
  setLoading(false);
  setResult(data);
};

export default searchChatMessages;
