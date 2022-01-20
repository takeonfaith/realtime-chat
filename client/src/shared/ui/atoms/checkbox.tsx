import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { Button } from ".";

interface Props {
  checked: boolean;
  setChecked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

const Checkbox = ({ checked, setChecked }: Props) => {
  return (
    <Button
      onClick={setChecked}
      icon={checked ? <BsCheckCircleFill /> : <RiCheckboxBlankCircleLine />}
      background="transparent"
      largeIcon
    />
  );
};

export default Checkbox;
