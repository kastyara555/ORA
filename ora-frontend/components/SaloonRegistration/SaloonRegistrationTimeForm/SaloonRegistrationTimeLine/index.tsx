import { FC, useMemo, useState } from "react";
import classNames from "classnames";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { BsChevronRight } from "react-icons/bs";

import { WorkTableDays, WorkDayModel } from "@/models/WorkTableModel";
import {
  DAY_NAMES_MAPPING,
  DEFAULT_WORKING_FINISH_HOURS,
  DEFAULT_WORKING_FINISH_MINUTES,
  DEFAULT_WORKING_START_HOURS,
  DEFAULT_WORKING_START_MINUTES,
  HOURS,
  MINUTES,
} from "@/consts/registration";
import { dayTimeByHours, prepareTime } from "@/utils";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface SaloonRegistrationTimeLineModel {
  dayName: WorkTableDays;
  dayConfig: WorkDayModel;
  setDayConfig: (dayConfig: WorkDayModel) => void;
}

interface EditingConfigModel {
  startHour: { code: string; name: string };
  startMinute: { code: string; name: string };
  finishHour: { code: string; name: string };
  finishMinute: { code: string; name: string };
}

const SaloonRegistrationTimeLine: FC<SaloonRegistrationTimeLineModel> = ({
  dayName,
  dayConfig,
  setDayConfig,
}) => {
  const { isWorking, startHour, startMinute, finishHour, finishMinute } =
    dayConfig;

  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [editingConfig, setEditingConfig] = useState<EditingConfigModel | null>(
    null
  );

  const setDayIsWorking = (value: boolean) => {
    const newDayConfig: WorkDayModel = { isWorking: value } as WorkDayModel;

    if (!value) {
      newDayConfig.startHour = null;
      newDayConfig.startMinute = null;
      newDayConfig.finishHour = null;
      newDayConfig.finishMinute = null;

      if (editingMode) {
        setEditingMode(false);
        setEditingConfig(null);
      }
    } else {
      newDayConfig.startHour = DEFAULT_WORKING_START_HOURS;
      newDayConfig.startMinute = DEFAULT_WORKING_START_MINUTES;
      newDayConfig.finishHour = DEFAULT_WORKING_FINISH_HOURS;
      newDayConfig.finishMinute = DEFAULT_WORKING_FINISH_MINUTES;
    }

    setDayConfig(newDayConfig);
  };

  const startEditing = () => {
    setEditingConfig({
      startHour: {
        code: startHour?.toString() ?? "0",
        name: startHour?.toString() ?? "0",
      },
      startMinute: {
        code: startMinute?.toString() ?? "0",
        name: startMinute?.toString() ?? "0",
      },
      finishHour: {
        code: finishHour?.toString() ?? "0",
        name: finishHour?.toString() ?? "0",
      },
      finishMinute: {
        code: finishMinute?.toString() ?? "0",
        name: finishMinute?.toString() ?? "0",
      },
    });

    setEditingMode(true);
  };

  const updateEditingConfig = (
    field: keyof EditingConfigModel,
    value: { code: string; name: string }
  ) => {
    setEditingConfig((oldState: EditingConfigModel | null) => {
      if (oldState) return { ...oldState, [field]: value };
      return null;
    });
  };

  const applyEditing = () => {
    if (editingConfig)
      setDayConfig({
        isWorking,
        startHour: +editingConfig.startHour.code,
        startMinute: +editingConfig.startMinute.code,
        finishHour: +editingConfig.finishHour.code,
        finishMinute: +editingConfig.finishMinute.code,
      });

    setEditingMode(false);
  };

  const applyButtonDisabled = useMemo(() => {
    const startHour = parseInt(editingConfig?.startHour.code ?? "0");
    const startMinute = parseInt(editingConfig?.startMinute.code ?? "0");
    const finishHour = parseInt(editingConfig?.finishHour.code ?? "0");
    const finishMinute = parseInt(editingConfig?.finishMinute.code ?? "0");

    const finishHourEarlierOrSameThenStart =
      startHour > finishHour ||
      (startHour === finishHour && startMinute >= finishMinute);

    if (finishHourEarlierOrSameThenStart) return true;

    return false;
  }, [editingConfig]);

  return (
    <div
      className={classNames(
        "w-full",
        "flex",
        "flex-wrap",
        "justify-content-between",
        "px-3"
      )}
    >
      <div className={classNames("flex", "align-items-center")}>
        <InputSwitch
          checked={isWorking}
          onChange={({ value }: InputSwitchChangeEvent) =>
            setDayIsWorking(!!value)
          }
        />
        <h3 className={classNames(styles.lightText, "pl-2")}>
          {DAY_NAMES_MAPPING[dayName]}
        </h3>
      </div>
      {isWorking && (
        <div
          className={classNames(
            styles.timeWrapper,
            "flex",
            "align-items-center",
            "justify-content-between"
          )}
          onClick={startEditing}
        >
          <h3 className={styles.lightText}>
            {prepareTime(startHour ?? 0, startMinute ?? 0)}
            &nbsp;
            {dayTimeByHours(startHour ?? 0)}
            &nbsp;—&nbsp;
            {prepareTime(finishHour ?? 0, finishMinute ?? 0)}
            &nbsp;
            {dayTimeByHours(finishHour ?? 0)}
          </h3>
          <div className={classNames("flex", "align-items-center", "pl-1")}>
            <BsChevronRight width={18} height={18} />
          </div>
        </div>
      )}
      {editingMode && editingConfig && (
        <div className={classNames("w-full", "flex", "flex-column")}>
          <h3 className={classNames(styles.lightText, "pt-3")}>
            Время начала работы
          </h3>
          <div className={classNames("w-full", "flex", "pt-2")}>
            <div className={classNames("flex", "align-items-center")}>
              <Dropdown
                options={HOURS}
                value={editingConfig.startHour}
                onChange={(e) => updateEditingConfig("startHour", e.value)}
                optionLabel="name"
              />
              &nbsp;<h3 className={styles.lightText}>Часов,</h3>
            </div>
            <div className={classNames("flex", "align-items-center", "pl-1")}>
              <Dropdown
                options={MINUTES}
                value={editingConfig.startMinute}
                onChange={(e) => updateEditingConfig("startMinute", e.value)}
                optionLabel="name"
              />
              &nbsp;<h3 className={styles.lightText}>Минут</h3>
            </div>
          </div>
          <h3 className={classNames(styles.lightText, "pt-3")}>
            Время завершения работы
          </h3>
          <div className={classNames("w-full", "flex", "pt-2")}>
            <div className={classNames("flex", "align-items-center")}>
              <Dropdown
                options={HOURS}
                value={editingConfig.finishHour}
                onChange={(e) => updateEditingConfig("finishHour", e.value)}
                optionLabel="name"
              />
              &nbsp;<h3 className={styles.lightText}>Часов,</h3>
            </div>
            <div className={classNames("flex", "align-items-center", "pl-1")}>
              <Dropdown
                options={MINUTES}
                value={editingConfig.finishMinute}
                onChange={(e) => updateEditingConfig("finishMinute", e.value)}
                optionLabel="name"
              />
              &nbsp;<h3 className={styles.lightText}>Минут</h3>
            </div>
          </div>
          <div className={classNames("w-full", "flex", "pt-3")}>
            <div className={classNames("w-full", "pr-1")}>
              <Button
                className="w-full"
                size="small"
                severity="secondary"
                onClick={() => setEditingMode(false)}
                outlined
              >
                Отменить
              </Button>
            </div>
            <div className={classNames("w-full", "pl-1")}>
              <Button
                className="w-full"
                size="small"
                onClick={applyEditing}
                disabled={applyButtonDisabled}
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaloonRegistrationTimeLine;
