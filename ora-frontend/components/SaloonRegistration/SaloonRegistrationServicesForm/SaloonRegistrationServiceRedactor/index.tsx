"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { AutoComplete, AutoCompleteChangeEvent } from "primereact/AutoComplete";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import isEqual from "lodash/isEqual";

import { searchProceduresUrl } from "@/api/categories";
import axiosInstance from "@/api";
import { HOURS_PROCEDURE, MINUTES_PROCEDURE } from "@/consts/registration";
import { SaloonRegistrationServiceModel } from "@/models/SaloonRegistration";

import styles from "./style.module.scss";

interface SaloonRegistrationServiceRedactorModel {
  initialValue: SaloonRegistrationServiceModel;
  onApply: (service: SaloonRegistrationServiceModel) => void;
  onCancel(): void;
}

const SaloonRegistrationServiceRedactor: FC<
  SaloonRegistrationServiceRedactorModel
> = ({ initialValue, onApply, onCancel }) => {
  const [service, setService] =
    useState<SaloonRegistrationServiceModel>(initialValue);
  const [filteredProcedures, setFilteredProcedures] = useState([]);

  const searchProcedure = useCallback(async (event: any) => {
    const response = await axiosInstance(
      searchProceduresUrl.concat(`/${event.query}`)
    );

    setFilteredProcedures(response.data);
  }, []);

  const isApplyButtonDisabled = useMemo<boolean>(() => {
    if (isEqual(initialValue, service)) return true;

    if (
      service.price === 0 ||
      service.procedure === null ||
      typeof service.procedure === 'string'  ||
      (+service.time.hours.code === 0 && +service.time.minutes.code === 0)
    )
      return true;

    return false;
  }, [
    service.price,
    service.procedure,
    service.time.hours.code,
    service.time.minutes.code,
  ]);

  const setProcedure = (e: AutoCompleteChangeEvent) =>
    setService((oldService) => ({ ...oldService, procedure: e.value }));

  const setPrice = (e: InputNumberValueChangeEvent) =>
    setService((oldService) => ({ ...oldService, price: e.value ?? 0 }));

  const setHours = (e: DropdownChangeEvent) =>
    setService((oldService) => ({
      ...oldService,
      time: { ...oldService.time, hours: e.value },
    }));

  const setMinutes = (e: DropdownChangeEvent) =>
    setService((oldService) => ({
      ...oldService,
      time: { ...oldService.time, minutes: e.value },
    }));

  useEffect(() => {
    setService(initialValue);
  }, [initialValue]);

  return (
    <div className={classNames("w-full", "grid", "row-gap-2", "m-0")}>
      <AutoComplete
        className={classNames("p-0", "col-12")}
        inputClassName="w-full"
        placeholder="Поиск процедур"
        field="procedureName"
        value={service.procedure}
        suggestions={filteredProcedures}
        completeMethod={searchProcedure}
        onChange={setProcedure}
      />
      <div className={classNames("col:sm-12", "col-6", "flex", "p-0")}>
        <div className={classNames("flex", "align-items-center")}>
          <Dropdown
            options={HOURS_PROCEDURE}
            value={service.time.hours}
            onChange={setHours}
            optionLabel="name"
          />
          &nbsp;<h3 className={styles.lightText}>ч.,</h3>
        </div>
        <div
          className={classNames("flex", "align-items-center", "pl-1", "p-0")}
        >
          <Dropdown
            options={MINUTES_PROCEDURE}
            value={service.time.minutes}
            onChange={setMinutes}
            optionLabel="name"
          />
          &nbsp;<h3 className={styles.lightText}>мин.</h3>
        </div>
      </div>
      <div
        className={classNames(
          "col-12",
          "lg:col-6",
          "xl:col-6",
          "p-inputgroup",
          "p-0"
        )}
      >
        <InputNumber
          value={service.price}
          onValueChange={setPrice}
          min={0}
          max={500}
        />
        <span className="p-inputgroup-addon">руб.</span>
      </div>

      <div className={classNames("col-12", "flex", "gap-2", "px-0")}>
        <Button
          className={classNames("w-full")}
          size="small"
          severity="secondary"
          onClick={onCancel}
          outlined
        >
          Отменить
        </Button>
        <Button
          className={classNames(styles.button, "w-full")}
          size="small"
          onClick={() => onApply(service)}
          disabled={isApplyButtonDisabled}
        >
          Применить
        </Button>
      </div>
    </div>
  );
};

export default SaloonRegistrationServiceRedactor;
