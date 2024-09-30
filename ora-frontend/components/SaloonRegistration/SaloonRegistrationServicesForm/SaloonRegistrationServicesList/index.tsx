import { FC } from "react";
import classNames from "classnames";
import { AiOutlineClose } from "react-icons/ai";
import { SaloonRegistrationServiceModel } from "@/models/SaloonRegistration";


import styles from "./style.module.scss";

interface SaloonRegistrationServicesListModel {
  services: SaloonRegistrationServiceModel[];
  deleteService: (index: number) => void;
}

const SaloonRegistrationServicesList: FC<
  SaloonRegistrationServicesListModel
> = ({ services, deleteService }) => {
  return (
    <div className={classNames("w-full", "flex-column")}>
      {services.map(({ procedure, time, price }, index) => (
        <div
          key={index}
          className={classNames(
            styles.service,
            "grid",
            "m-0",
            "align-items-stretch"
          )}
          style={{ backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5" }}
        >
          <div
            className={classNames(
              styles.actionButton,
              "flex",
              "align-items-center",
              "col-fixed"
            )}
            style={{ width: 32 }}
            onClick={() => deleteService(index)}
          >
            <AiOutlineClose />
          </div>
          <div className={classNames("flex", "align-items-center", "col")}>
            {procedure?.procedureName}
          </div>
          <div
            className={classNames(
              "flex",
              "align-items-center",
              "col",
              "col-fixed"
            )}
            style={{ width: 128 }}
          >
            {+time.hours.name ? `${time.hours.name} ч.` : null}
            {+time.minutes.name ? `${time.minutes.name} мин.` : null}
          </div>
          <div
            className={classNames(
              "flex",
              "align-items-center",
              "col",
              "col-fixed"
            )}
            style={{ width: 96 }}
          >
            {price}&nbsp;руб.
          </div>
        </div>
      ))}
    </div>
  );
};

export default SaloonRegistrationServicesList;
