import { chatApi } from "../../../shared/api";

const searchChatMessages = async (
  chatId: string,
  value: string,
  setResult: (params: any) => any
) => {
  const { data } = await chatApi.searchChatMessages(chatId, value);
  console.log(data);

  setResult(data);
};

export default searchChatMessages;
