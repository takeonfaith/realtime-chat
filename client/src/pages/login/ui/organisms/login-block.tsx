import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SIGNUP_ROUTE } from "../../../../app/routes/routes";
import { userModel } from "../../../../entities/user";
import { Input, SubmitButton, Title } from "../../../../shared/ui/atoms";
import ErrorMessage from "../atoms/error-message";

const LoginBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 450px;
  background: var(--theme);
  color: var(--text);
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

const LoginBlock = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const loginFunc = userModel.events.login;
  const { loading, error } = userModel.selectors.useUser();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      loginFunc({ login, password });
    }
  };

  return (
    <LoginBlockWrapper onKeyPress={handleKeyPress}>
      <Title size={2} align="left">
        Вход в аккаунт
      </Title>
      <ErrorMessage message={error} />
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
        Нет аккаунта?
        <Link to={SIGNUP_ROUTE}>Зарегистрироваться</Link>
      </div>
      <SubmitButton
        text="Вход"
        action={() => loginFunc({ login, password })}
        isLoading={loading.login}
        completed={false}
        setCompleted={() => null}
        isActive={!!password && !!login}
      />
    </LoginBlockWrapper>
  );
};

export default LoginBlock;
