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
  action?: () => void;
  loading?: boolean;
  completed?: boolean;
  setCompleted?: (completed: boolean) => void;
  isActive?: boolean;
  ableToChange: boolean;
  submit?: boolean;
  background?: string;
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
  background,
  submit = true,
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
          <Input
            value={value}
            setValue={setValue}
            placeholder={placeholder}
            background={background}
          />
          {submit && (
            <SubmitButton
              text={"Изменить"}
              action={() => (!!action ? action() : null)}
              isLoading={loading ?? false}
              completed={completed ?? false}
              setCompleted={(completed: boolean) =>
                setCompleted ? setCompleted(completed) : null
              }
              isActive={isActive ?? false}
            />
          )}
        </div>
      ) : (
        <b>{value}</b>
      )}
    </RenameFieldWrapper>
  );
};

export default RenameField;
