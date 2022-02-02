import { userApi } from "../../../shared/api";

const searchPeople = async (
  userId: string,
  value: string,
  setResult: (params: any) => any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const { data } = await userApi.searchUsers(value, userId);
  setLoading(false);
  setResult(data);
};

export default searchPeople;
