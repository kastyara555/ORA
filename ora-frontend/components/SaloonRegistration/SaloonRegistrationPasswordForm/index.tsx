"use client";
import { ChangeEvent, FC, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

import { RegistrationSaloonPasswordFormModel } from "@/models/SaloonRegistration";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetPasswordForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationPasswordFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationPasswordForm: FC<
  SaloonRegistrationPasswordFormModel
> = ({ onCountinueClick }) => {
  const { passwordForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const [state, setState] =
    useState<RegistrationSaloonPasswordFormModel>(passwordForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetPasswordForm(state));
    onCountinueClick();
  };

  const setPassword = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      password: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (state.password.length < 5) return true;

    return false;
  }, [state]);

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-3",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>Пароль</h2>
      <p className={classNames(styles.lightText, styles.subTitle)}>
        Введите пароль для профиля вашей компании/салона
      </p>
      <Password
        className={classNames("p-0", "w-full")}
        inputClassName={classNames(styles.input, "w-full")}
        placeholder="Пароль"
        promptLabel="Введите пароль"
        weakLabel="Лёгкий пароль"
        mediumLabel="Средний пароль"
        strongLabel="Тяжёлый пароль"
        value={state.password}
        onChange={setPassword}
        maxLength={32}
        toggleMask
      />
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mt-4",
          "mb-3"
        )}
        onClick={onApply}
        disabled={disabledButton}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationPasswordForm;
