"use client";
import { FC, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";

import WorkTableModel, {
  WorkTableDays,
  WorkDayModel,
} from "@/models/WorkTableModel";
import SaloonRegistrationTimeLine from "@/components/SaloonRegistration/SaloonRegistrationTimeForm/SaloonRegistrationTimeLine";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetTimeForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationTimeFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationTimeForm: FC<SaloonRegistrationTimeFormModel> = ({
  onCountinueClick,
}) => {
  const { timeForm } = useSelector(registrationSaloonSelectedValuesSelector);

  const [state, setState] = useState<WorkTableModel>(
    JSON.parse(timeForm.timeLine)
  );

  const setDayConfig = (dayName: WorkTableDays, newDayConfig: WorkDayModel) => {
    setState((state) => ({
      ...state,
      [dayName]: {
        ...state[dayName],
        ...newDayConfig,
      },
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    let weekendCount = 0;
    Object.values(state).forEach((dayConfig) => {
      if (!dayConfig.isWorking) weekendCount++;
    });

    if (weekendCount === 7) return true;

    return false;
  }, [state]);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(
      registrationSaloonSetTimeForm({
        timeLine: JSON.stringify(state),
      })
    );
    onCountinueClick();
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
      {Object.entries(state).map(([dayName, dayConfig], index) => (
        <div
          style={{ backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5" }}
          className={classNames("w-full", "py-3")}
          key={dayName}
        >
          <SaloonRegistrationTimeLine
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
        disabled={disabledButton}
        onClick={onApply}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationTimeForm;
