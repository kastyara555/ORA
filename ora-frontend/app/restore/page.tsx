"use client";
import { ChangeEvent, useMemo, useState } from "react";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";

import Button from "@/components/Button";

import styles from "./page.module.scss";

interface RestorePageStateModel {
  login: string;
}

const RESTORE_INITIAL_STATE: RestorePageStateModel = {
  login: "",
};

const Restore = () => {
  const [state, setState] = useState<RestorePageStateModel>(
    RESTORE_INITIAL_STATE
  );

  const setLogin = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      login: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.login.length) return true;

    return false;
  }, [state]);

  return (
    <div className={classNames(styles.main, "px-2")}>
      <div className={styles.restoreFormWrapper}>
        <h2 className={classNames(styles.title, "pb-2", "mb-4", "w-full")}>
          Восстановление пароля
        </h2>
        <InputText
          className={classNames(styles.input, "mb-4", "w-full")}
          placeholder="Email/номер телефона"
          maxLength={32}
          value={state.login}
          onChange={setLogin}
        />
        <Button
          className={classNames(
            "mb-5",
            "w-full",
            "flex",
            "align-items-center",
            "justify-content-center"
          )}
          disabled={disabledButton}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default Restore;
