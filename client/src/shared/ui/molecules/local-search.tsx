import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { userModel } from "../../../entities/user";
import normalizeString from "../../lib/normalize-string";
import Input from "../atoms/input";

interface Props<T, R> {
  searchEngine: (
    userId: string,
    value: string,
    setResult: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<R> | null;
  setResult: any;
  placeholder?: string;
  defaultList?: any[] | null;
}

const LocalSearch = <T, R>({
  searchEngine,
  setResult,
  placeholder = "Поиск по меню",
  defaultList = null,
}: Props<T, R>) => {
  const [value, setValue] = useState("");
  const {
    data: { user },
  } = userModel.selectors.useUser();
  const [loading, setLoading] = useState(false);

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLoading(true);
      searchEngine(user?._id ?? "", value, setResult, setLoading);
    }
  };

  useEffect(() => {
    if (!normalizeString(value).length) setResult(defaultList);
  }, [value]);

  return (
    <Input
      loading={loading}
      value={value}
      setValue={setValue}
      placeholder={placeholder}
      leftIcon={<FiSearch />}
      onKeyDown={search}
    />
  );
};

export default LocalSearch;
