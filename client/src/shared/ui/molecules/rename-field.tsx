import React, { useRef, useState } from "react";
import styled from "styled-components";
import useOnClickOutside from "../../lib/hooks/use-on-click-outside";
import { Input, SubmitButton } from "../atoms";

const RenameFieldWrapper = styled.div`
  .input-and-button {
    display: flex;
    flex-direction: column;
    align-items: center;

    & > * + * {
      margin-top: 5px;
    }
  }
`;

interface Props {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  action: () => void;
  loading: boolean;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  isActive: boolean;
  ableToChange: boolean;
}

const RenameField = ({
  value,
  setValue,
  placeholder,
  action,
  loading,
  completed,
  setCompleted,
  isActive,
  ableToChange,
}: Props) => {
  const [isInput, setIsInput] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(fieldRef, () => setIsInput(false));

  return (
    <RenameFieldWrapper
      onClick={() => {
        setIsInput(true);
      }}
      ref={fieldRef}
    >
      {isInput && ableToChange ? (
        <div className="input-and-button">
          <Input value={value} setValue={setValue} placeholder={placeholder} />
          <SubmitButton
            text={"Изменить"}
            action={action}
            isLoading={loading}
            completed={completed}
            setCompleted={setCompleted}
            isActive={isActive}
          />
        </div>
      ) : (
        <b>{value}</b>
      )}
    </RenameFieldWrapper>
  );
};

export default RenameField;
