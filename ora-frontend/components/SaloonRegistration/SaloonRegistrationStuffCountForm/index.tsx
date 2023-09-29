"use client";
import { FC } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";

import styles from "./style.module.scss";

interface SaloonRegistrationStuffCountFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationStuffCountForm: FC<SaloonRegistrationStuffCountFormModel> = ({
  onCountinueClick,
}) => {
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
        <RadioButton inputId="onlyMe" />
        <label
          htmlFor="onlyMe"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>Только я</h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton inputId="few" />
        <label
          htmlFor="few"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>2 — 3 мастера</h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton inputId="aFew" />
        <label
          htmlFor="aFew"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>4 — 6 мастеров</h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12")}>
        <RadioButton inputId="many" />
        <label
          htmlFor="many"
          className={classNames(styles.lightText, "ml-2")}
        >
          <h3 className={classNames(styles.lightText, "mb-1")}>Больше, чем 6 мастеров</h3>
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
        onClick={onCountinueClick}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationStuffCountForm;
