import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import styled from "styled-components";
import { Button } from ".";

const CheckboxWrapper = styled.div<{
  invisibleOnFalse: boolean;
  checked: boolean;
}>`
  transition: 0.1s;
  opacity: ${({ invisibleOnFalse, checked }) =>
    invisibleOnFalse ? (checked ? 1 : 0) : 1};
  transform: scale(
    ${({ invisibleOnFalse, checked }) =>
      invisibleOnFalse ? (checked ? 1 : 0.8) : 1}
  );

  svg {
    color: var(--reallyBlue);
    background: var(--theme);
    border-radius: 100%;
    padding: 2px;
  }
`;

interface Props {
  checked: boolean;
  setChecked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  invisibleOnFalse?: boolean;
}

const Checkbox = ({ checked, setChecked, invisibleOnFalse = false }: Props) => {
  return (
    <CheckboxWrapper checked={checked} invisibleOnFalse={invisibleOnFalse}>
      <Button
        onClick={setChecked}
        icon={
          checked || invisibleOnFalse ? (
            <BsCheckCircleFill />
          ) : (
            <RiCheckboxBlankCircleLine />
          )
        }
        background="transparent"
        largeIcon
      />
    </CheckboxWrapper>
  );
};

export default Checkbox;
