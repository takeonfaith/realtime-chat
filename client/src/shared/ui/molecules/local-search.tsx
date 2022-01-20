import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { userModel } from "../../../entities/user";
import normalizeString from "../../lib/normalize-string";
import Input from "../atoms/input";

interface Props<T, R> {
  searchEngine: (
    userId: string,
    value: string,
    setResult: any
  ) => Promise<R> | null;
  setResult: any;
  placeholder?: string;
}

const LocalSearch = <T, R>({
  searchEngine,
  setResult,
  placeholder = "Поиск по меню",
}: Props<T, R>) => {
  const [value, setValue] = useState("");
  const {
    data: { user },
  } = userModel.selectors.useUser();

  useEffect(() => {
    if (normalizeString(value).length)
      searchEngine(user?._id ?? "", value, setResult);
    else setResult(null);
  }, [value]);

  return (
    <Input
      value={value}
      setValue={setValue}
      placeholder={placeholder}
      leftIcon={<FiSearch />}
    />
  );
};

export default LocalSearch;
