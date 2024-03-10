import { FC } from "react";
import classNames from "classnames";

import WorkTableModel from "@/models/WorkTableModel";

import styles from "./style.module.scss";
import { InputSwitch } from "primereact/inputswitch";
import { DAY_NAMES_MAPPING } from "@/consts/registration";
import { prepareTime } from "@/utils";

interface SaloonEditTimeProps {
  value: WorkTableModel;
}

const SaloonEditTime: FC<SaloonEditTimeProps> = ({ value }) => (
  <div
    className={classNames(
      "w-full",
      "flex",
      "gap-0",
      "flex-column",
      "align-items-center",
      "pt-6"
    )}
  >
    <h2 className={styles.lightText}>Ваше время работы</h2>
    {Object.entries(value).map(([dayName, dayConfig], index) => (
      <div
        style={{ backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5" }}
        className={classNames(
          "flex",
          "w-full",
          "p-3",
          "justify-content-between"
        )}
        key={dayName}
      >
        <div className={classNames("flex", "align-items-center")}>
          <InputSwitch checked={dayConfig.isWorking} disabled />
          <h3 className={classNames(styles.lightText, "pl-2")}>
            {DAY_NAMES_MAPPING[dayName as keyof WorkTableModel]}
          </h3>
        </div>
        {dayConfig.isWorking && (
          <h3 className={styles.lightText}>
            {prepareTime(
              +dayConfig.startHour ?? 0,
              +dayConfig.startMinute ?? 0
            )}{" "}
            -{" "}
            {prepareTime(
              +dayConfig.finishHour ?? 0,
              +dayConfig.finishMinute ?? 0
            )}
          </h3>
        )}
      </div>
    ))}
  </div>
);

export default SaloonEditTime;
