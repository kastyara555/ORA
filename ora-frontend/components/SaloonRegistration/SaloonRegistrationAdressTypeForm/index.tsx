"use client";
import { FC } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";

import styles from "./style.module.scss";

interface SaloonRegistrationAdressTypeFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAdressTypeForm: FC<SaloonRegistrationAdressTypeFormModel> = ({
  onCountinueClick,
}) => {
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
        <RadioButton inputId="haveAdress" />
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
        <RadioButton inputId="haveNotAdress" />
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

export default SaloonRegistrationAdressTypeForm;
