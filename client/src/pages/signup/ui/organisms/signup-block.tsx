import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LOGIN_ROUTE } from "../../../../app/routes/routes";
import { userModel } from "../../../../entities/user";
import { Input, SubmitButton, Title } from "../../../../shared/ui/atoms";
import ErrorMessage from "../atoms/error-message";

const SignUpBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 450px;
  background: #3e4aa2;
  color: #fff;
  border-radius: 8px;
  padding: 20px;
  row-gap: 20px;

  .link {
    display: flex;
    justify-content: center;
    align-self: center;

    a {
      margin-left: 5px;
      color: var(--blue);
    }
  }

  @media (max-width: 1000px) {
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    height: 100%;
    justify-content: center;
  }
`;

const SignUpBlock = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const signUpFunc = userModel.events.signUp;
  const { loading, error } = userModel.selectors.useUser();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      signUpFunc({ name, login, password });
    }
  };

  return (
    <SignUpBlockWrapper onKeyPress={handleKeyPress}>
      <Title size={2} align="left">
        Регистрация
      </Title>
      <ErrorMessage message={error} />
      <Input
        value={name}
        setValue={setName}
        title="Имя"
        placeholder="Введите имя"
      />
      <Input
        value={login}
        setValue={setLogin}
        title="Логин"
        placeholder="Введите логин"
      />
      <Input
        value={password}
        setValue={setPassword}
        title="Пароль"
        placeholder="Введите пароль"
        type="password"
      />
      <div className="link">
        Уже есть аккаунт?
        <Link to={LOGIN_ROUTE}>Войти</Link>
      </div>
      <SubmitButton
        text="Регистрация"
        action={() => {
          signUpFunc({ name, login, password });
        }}
        isLoading={loading}
        completed={false}
        setCompleted={() => null}
        isActive={!!password && !!login}
      />
    </SignUpBlockWrapper>
  );
};

export default SignUpBlock;
