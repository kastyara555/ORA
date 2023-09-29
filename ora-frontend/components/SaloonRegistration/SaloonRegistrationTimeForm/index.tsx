"use client";
import { FC, useState } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";

import WorkTableModel, {
  WorkTableDays,
  WorkDayModel,
} from "@/models/WorkTableModel";
import { INITIAL_TIME_TABLE } from "@/consts/registration";
import SaloonRegistrationTimeLine from "@/components/SaloonRegistration/SaloonRegistrationTimeForm/SaloonRegistrationTimeLine";

import styles from "./style.module.scss";

interface SaloonRegistrationTimeFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationTimeForm: FC<SaloonRegistrationTimeFormModel> = ({
  onCountinueClick,
}) => {
  const [timeTable, setTimeTable] =
    useState<WorkTableModel>(INITIAL_TIME_TABLE);

  const setDayConfig = (dayName: WorkTableDays, newDayConfig: WorkDayModel) => {
    setTimeTable((state) => ({
      ...state,
      [dayName]: {
        ...state[dayName],
        ...newDayConfig,
      },
    }));
  };

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-0",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>Ваше время работы</h2>
      {Object.entries(timeTable).map(([dayName, dayConfig], index) => (
        <div
          style={{ backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5" }}
          className={classNames("w-full", "py-3")}
        >
          <SaloonRegistrationTimeLine
            key={dayName}
            dayName={dayName as WorkTableDays}
            dayConfig={dayConfig}
            setDayConfig={(newDayConfig) =>
              setDayConfig(dayName as WorkTableDays, newDayConfig)
            }
          />
        </div>
      ))}
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mt-4"
        )}
        onClick={onCountinueClick}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationTimeForm;
