"use client";
import { FC, useState } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { useDispatch, useSelector } from "react-redux";

import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { RegistrationSaloonStuffCountFormModel } from "@/models/SaloonRegistration";
import { registrationSaloonSetStuffCountForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationStuffCountFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationStuffCountForm: FC<
  SaloonRegistrationStuffCountFormModel
> = ({ onCountinueClick }) => {
  const { stuffCountForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const [state, setState] =
    useState<RegistrationSaloonStuffCountFormModel>(stuffCountForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetStuffCountForm(state));
    onCountinueClick();
  };

  const setStuffCount = (e: RadioButtonChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      count: e.value,
    }));
  };

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-2",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={classNames(styles.title, styles.lightText)}>
        Сколько мастеров работает в Вашем салоне?
      </h2>

      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="onlyMe"
          checked={state.count === 1}
          value={1}
          onChange={setStuffCount}
        />
        <label
          htmlFor="onlyMe"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>Только я</h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="few"
          checked={state.count === 2}
          value={2}
          onChange={setStuffCount}
        />
        <label htmlFor="few" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>
            2 — 3 мастера
          </h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="aFew"
          checked={state.count === 4}
          value={4}
          onChange={setStuffCount}
        />
        <label htmlFor="aFew" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>
            4 — 6 мастеров
          </h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton
          inputId="many"
          checked={state.count === 7}
          value={7}
          onChange={setStuffCount}
        />
        <label htmlFor="many" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>
            Больше, чем 6 мастеров
          </h3>
        </label>
      </div>
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12"
        )}
        onClick={onApply}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationStuffCountForm;
