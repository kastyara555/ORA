"use client";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { RegistrationSaloonAdressTypeFormModel } from "@/models/SaloonRegistration";
import { registrationSaloonSetAdressTypeForm } from "@/store/registrationSaloon/actions";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface SaloonRegistrationAdressTypeFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAdressTypeForm: FC<
  SaloonRegistrationAdressTypeFormModel
> = ({ onCountinueClick }) => {
  const { adressTypeForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const [state, setState] =
    useState<RegistrationSaloonAdressTypeFormModel>(adressTypeForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetAdressTypeForm(state));
    onCountinueClick();
  };

  const setAdressType = (e: RadioButtonChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      hasAdress: e.value,
    }));
  };

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
      <h2 className={classNames(styles.title, styles.lightText)}>
        В какой категории клиент сможет найти вас?
      </h2>
      <p className={classNames(styles.lightText, styles.subtitle)}>
        Вы работаете в салоне или работаете по выезду
      </p>

      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="haveAdress"
          checked={state.hasAdress}
          value={true}
          onChange={setAdressType}
        />
        <label
          htmlFor="haveAdress"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>Стационарно</h3>
          Работаем стационарно. Имею личный салон, работаю с другими мастерами
          разных услуг в одном помещении.
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="haveNotAdress"
          checked={!state.hasAdress}
          value={false}
          onChange={setAdressType}
        />
        <label
          htmlFor="haveNotAdress"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>По выезду</h3>
          Предоставляю услуги в месте выбранным клиентом.
        </label>
      </div>
      <Button
        className={classNames(
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mb-3"
        )}
        onClick={onApply}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationAdressTypeForm;
