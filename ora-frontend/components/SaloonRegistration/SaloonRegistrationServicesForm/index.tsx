"use client";
import { FC, useState } from "react";
import classNames from "classnames";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "primereact/button";

import SaloonRegistrationServiceRedactor from "@/components/SaloonRegistration/SaloonRegistrationServicesForm/SaloonRegistrationServiceRedactor";
import SaloonRegistrationServicesList from "@/components/SaloonRegistration/SaloonRegistrationServicesForm/SaloonRegistrationServicesList";
import { DEFAULT_SERVICE_TO_BE_ADDED } from "@/consts/registration";
import { SaloonRegistrationServiceModel } from "@/models/SaloonRegistration";

import styles from "./style.module.scss";

interface SaloonRegistrationServicesFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationServicesForm: FC<
  SaloonRegistrationServicesFormModel
> = ({ onCountinueClick }) => {
  const [services, setServices] = useState<SaloonRegistrationServiceModel[]>(
    []
  );
  const [addingMode, setAddingMode] = useState<boolean>(false);

  const appendService = (newService: SaloonRegistrationServiceModel) => {
    setServices((oldServices) => [...oldServices, newService]);
    setAddingMode(false);
  };

  const deleteService = (index: number) => {
    setServices((oldServices) => {
      const tmpServices = [...oldServices];

      tmpServices.splice(index, 1);

      return tmpServices;
    });
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
      <h2 className={styles.lightText}>Ваши услуги</h2>
      <p className={classNames(styles.lightText, styles.subtitle)}>
        Вы можете указать свои услуги прямо сейчас
      </p>

      {services.length ? (
        <SaloonRegistrationServicesList services={services} deleteService={deleteService} />
      ) : (
        <h3 className={styles.lightText}>
          Вы пока не добавили услуги, этот шаг можно пропустить.
        </h3>
      )}

      <div className={classNames("w-full", "pt-8")}>
        {addingMode ? (
          <SaloonRegistrationServiceRedactor
            initialValue={DEFAULT_SERVICE_TO_BE_ADDED}
            onCancel={() => setAddingMode(false)}
            onApply={appendService}
          />
        ) : (
          <div
            className={classNames(
              styles.addingButton,
              "w-full",
              "flex",
              "grid",
              "align-items-center",
              "py-1"
            )}
            onClick={() => setAddingMode(true)}
          >
            <div className={classNames("flex", "align-items-center", "col-2")}>
              <AiOutlinePlus color="#7E7E7E" />
            </div>
            <h4 className={styles.lightText}>Добавить услугу</h4>
          </div>
        )}
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

export default SaloonRegistrationServicesForm;
