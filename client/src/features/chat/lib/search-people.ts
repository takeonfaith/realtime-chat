import { userApi } from "../../../shared/api";

const searchPeople = async (
  userId: string,
  value: string,
  setResult: (params: any) => any
) => {
  const { data } = await userApi.searchUsers(value, userId);

  setResult(data);
};

export default searchPeople;
