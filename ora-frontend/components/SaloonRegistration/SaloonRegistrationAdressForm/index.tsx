"use client";
import { FC, useState, useEffect, useMemo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

import {
  registrationSaloonLoadingSelector,
  registrationSaloonCitiesSelector,
  registrationSaloonSelectedValuesSelector,
} from "@/store/registrationSaloon/selectors";
import {
  registrationSaloonFetchCities,
  registrationSaloonSetAdressForm,
} from "@/store/registrationSaloon/actions";
import { RegistrationSaloonAdressFormModel } from "@/models/SaloonRegistration";
import { isNumeric } from "@/utils";

import styles from "./style.module.scss";

interface SaloonRegistrationAdressFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAdressForm: FC<SaloonRegistrationAdressFormModel> = ({
  onCountinueClick,
}) => {
  const { adressForm } = useSelector(registrationSaloonSelectedValuesSelector);
  const {
    adressTypeForm: { hasAdress },
  } = useSelector(registrationSaloonSelectedValuesSelector);
  const citiesList = useSelector(registrationSaloonCitiesSelector);
  const loading = useSelector(registrationSaloonLoadingSelector);

  const [state, setState] =
    useState<RegistrationSaloonAdressFormModel>(adressForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetAdressForm(state));
    onCountinueClick();
  };

  const setStreet = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      street: (e.target as HTMLInputElement).value,
    }));
  };

  const setStage = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      stage: (e.target as HTMLInputElement).value,
    }));
  };

  const setBuilding = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      building: (e.target as HTMLInputElement).value,
    }));
  };

  const setOffice = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      office: (e.target as HTMLInputElement).value,
    }));
  };

  const setCity = (e: DropdownChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      city: e.value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.city) return true;

    if (
      hasAdress &&
      (!state.street.length ||
        !isNumeric(state.building) ||
        !isNumeric(state.stage) ||
        !isNumeric(state.office))
    ) {
      return true;
    }

    return false;
  }, [state]);

  useEffect(() => {
    if (!citiesList.length) dispatch(registrationSaloonFetchCities() as any);
  }, []);

  return !loading ? (
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
      <h2 className={styles.lightText}>Адрес вашего салона/компании</h2>
      <p className={classNames(styles.lightText, styles.title)}>
        Где клиенты могут найти Вас
      </p>
      <Dropdown
        value={state.city}
        onChange={setCity}
        options={citiesList}
        showClear
        placeholder="Город"
        className={classNames(styles.input, "w-full")}
        optionLabel="name"
      />
      {hasAdress && (
        <div
          className={classNames("w-full", "grid", "column-gap-2", "row-gap-4")}
        >
          <InputText
            className={classNames(styles.input, "w-full", "col-12")}
            placeholder="Улица"
            maxLength={32}
            value={state.street}
            onChange={setStreet}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Дом"
            maxLength={32}
            value={state.building}
            onChange={setBuilding}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Этаж"
            maxLength={32}
            value={state.stage}
            onChange={setStage}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Офис"
            maxLength={32}
            value={state.office}
            onChange={setOffice}
            style={{ height: 45 }}
          />
        </div>
      )}
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12"
        )}
        onClick={onApply}
        disabled={disabledButton}
      >
        Продолжить
      </Button>
    </div>
  ) : (
    <div style={{ maxWidth: 448, width: "100%" }}>
      <Skeleton width="100%" height="386px" />
    </div>
  );
};

export default SaloonRegistrationAdressForm;
