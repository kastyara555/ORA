"use client";
import { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

import {
  registrationSaloonLoadingSelector,
  registrationSaloonCitiesSelector,
} from "@/store/registrationSaloon/selectors";
import { registrationSaloonFetchCities } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationAdressFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAdressForm: FC<SaloonRegistrationAdressFormModel> = ({
  onCountinueClick,
}) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const dispatch = useDispatch();

  const citiesList = useSelector(registrationSaloonCitiesSelector);
  const loading = useSelector(registrationSaloonLoadingSelector);

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
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={citiesList}
        showClear
        placeholder="Город"
        className={classNames(styles.input, "w-full")}
        optionLabel="name"
      />
      <div
        className={classNames("w-full", "grid", "column-gap-2", "row-gap-4")}
      >
        <InputText
          className={classNames(styles.input, "w-full", "col-12")}
          placeholder="Улица"
          maxLength={32}
          style={{ height: 45 }}
        />
        <InputText
          className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
          placeholder="Дом"
          maxLength={32}
          style={{ height: 45 }}
        />
        <InputText
          className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
          placeholder="Этаж"
          maxLength={32}
          style={{ height: 45 }}
        />
        <InputText
          className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
          placeholder="Офис"
          maxLength={32}
          style={{ height: 45 }}
        />
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
  ) : (
    <div style={{ maxWidth: 448, width: "100%" }}>
      <Skeleton width="100%" height="386px" />
    </div>
  );
};

export default SaloonRegistrationAdressForm;
