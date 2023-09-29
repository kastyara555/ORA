"use client";
import { FC } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";

import styles from "./style.module.scss";
import { InputText } from "primereact/inputtext";

interface SaloonRegistrationVisitPaymentFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationVisitPaymentForm: FC<
  SaloonRegistrationVisitPaymentFormModel
> = ({ onCountinueClick }) => {
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
        Какую плату Вы берёте за выезд на место оказания услуги?
      </h2>

      <div className={classNames("flex", "pb-2", "w-full", "col-12", "align-items-baseline")}>
        <RadioButton inputId="free" />
        <label htmlFor="free" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>Бесплатно</h3>
        </label>
      </div>
      <div className={classNames("flex", "pb-2", "w-full", "col-12", "align-items-baseline")}>
        <RadioButton inputId="pay" />
        <label htmlFor="pay" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>
            Платно, стоимость&nbsp;—&nbsp;<InputText type="number" min={1} max={100} />
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
        onClick={onCountinueClick}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationVisitPaymentForm;
