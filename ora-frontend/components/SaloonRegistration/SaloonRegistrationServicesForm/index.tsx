"use client";
import { FC, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "primereact/button";

import SaloonRegistrationServiceRedactor from "@/components/SaloonRegistration/SaloonRegistrationServicesForm/SaloonRegistrationServiceRedactor";
import SaloonRegistrationServicesList from "@/components/SaloonRegistration/SaloonRegistrationServicesForm/SaloonRegistrationServicesList";
import { DEFAULT_SERVICE_TO_BE_ADDED } from "@/consts/registration";
import {
  RegistrationSaloonServicesFormModel,
  SaloonRegistrationServiceModel,
} from "@/models/SaloonRegistration";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetServicesForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationServicesFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationServicesForm: FC<
  SaloonRegistrationServicesFormModel
> = ({ onCountinueClick }) => {
  const { servicesForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const [state, setState] =
    useState<RegistrationSaloonServicesFormModel>(servicesForm);
  const [addingMode, setAddingMode] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetServicesForm(state));
    onCountinueClick();
  };

  const appendService = (newService: SaloonRegistrationServiceModel) => {
    setState((oldState) => ({
      ...oldState,
      services: [...oldState.services, newService],
    }));
    setAddingMode(false);
  };

  const deleteService = (index: number) => {
    setState((oldState) => {
      const tmpServices = [...oldState.services];
      tmpServices.splice(index, 1);
      const newServices = tmpServices;

      return { ...oldState, services: newServices };
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

      {state.services.length ? (
        <SaloonRegistrationServicesList
          services={state.services}
          deleteService={deleteService}
        />
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
          "col-12",
          "mb-3"
        )}
        onClick={onApply}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationServicesForm;
