"use client";
import { ChangeEvent, useMemo, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

import styles from "./page.module.scss";

interface LoginPageStateModel {
  login: string;
  password: string;
}

const LOGIN_INITIAL_STATE: LoginPageStateModel = {
  login: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState<LoginPageStateModel>(LOGIN_INITIAL_STATE);

  const setLogin = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      login: (e.target as HTMLInputElement).value,
    }));
  };

  const setPassword = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      password: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.login.length || !state.password.length) return true;

    return false;
  }, [state]);

  return (
    <div className={classNames(styles.main, "px-2")}>
      <div className={styles.loginFormWrapper}>
        <h2 className={classNames(styles.title, "pb-2", "mb-4", "w-full")}>
          Авторизация
        </h2>
        <InputText
          className={classNames(styles.input, "mb-2", "w-full")}
          placeholder="Email/номер телефона"
          maxLength={32}
          value={state.login}
          onChange={setLogin}
        />
        <Password
          className={classNames("mb-4", "w-full")}
          inputClassName={classNames(styles.input, styles.password)}
          placeholder="Пароль"
          feedback={false}
          maxLength={32}
          value={state.password}
          onChange={setPassword}
          toggleMask
        />
        <Button
          className={classNames(
            styles.button,
            "mb-5",
            "w-full",
            "flex",
            "align-items-center",
            "justify-content-center"
          )}
          disabled={disabledButton}
        >
          Войти
        </Button>
        <Link
          href="/registration/user"
          className={classNames(styles.link, "mb-3")}
        >
          Регистрация
        </Link>
        <Link className={styles.link} href="/restore">
          Забыли пароль?
        </Link>
      </div>
    </div>
  );
};

export default Login;
