"use client";
import { ChangeEvent, FC, useState, useMemo } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { RegistrationSaloonEmailFormModel } from "@/models/SaloonRegistration";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetEmailForm } from "@/store/registrationSaloon/actions";
import { isEmailValid } from "@/utils/forms";

import styles from "./style.module.scss";

interface SaloonRegistrationEmailFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationEmailForm: FC<SaloonRegistrationEmailFormModel> = ({
  onCountinueClick,
}) => {
  const { emailForm } = useSelector(registrationSaloonSelectedValuesSelector);
  const [state, setState] =
    useState<RegistrationSaloonEmailFormModel>(emailForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetEmailForm(state));
    onCountinueClick();
  };

  const setEmail = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      email: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.email.length || !isEmailValid(state.email)) return true;

    return false;
  }, [state]);

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-4",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>
        Введите Ваш адрес
        <br />
        электронной почты
      </h2>
      <InputText
        className={classNames(styles.input, "w-full", "mt-2")}
        placeholder="Электронная почта"
        type="email"
        value={state.email}
        onChange={setEmail}
        maxLength={32}
      />
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12"
        )}
        disabled={disabledButton}
        onClick={onApply}
      >
        Продолжить
      </Button>
      <p className={classNames(styles.lightText, styles.policy)}>
        Соображения высшего порядка, а также начало повседневной работы по
        формированию позиции требует определения и уточнения дальнейших
        направлений развития проекта.
      </p>
    </div>
  );
};

export default SaloonRegistrationEmailForm;
