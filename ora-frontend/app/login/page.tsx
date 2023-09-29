"use client";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import Link from "next/link";
import { Button } from "primereact/button";

import styles from "./page.module.scss";
import { Password } from "primereact/password";

const Login = () => {
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
        />
        <Password
          className={classNames("mb-4", "w-full")}
          inputClassName={classNames(styles.input, styles.password)}
          placeholder="Пароль"
          feedback={false}
          maxLength={32}
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
        >
          Войти
        </Button>
        <Link href="/registration/user" className={classNames(styles.link, "mb-3")}>
          Регистрация
        </Link>
        <Link className={styles.link} href="/registration/user">
          Забыли пароль?
        </Link>
      </div>
    </div>
  );
};

export default Login;
