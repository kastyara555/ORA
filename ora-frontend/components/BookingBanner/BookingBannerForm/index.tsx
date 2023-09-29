"use client";
import { FC, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/AutoComplete";
import { addLocale } from "primereact/api";

import { SelectItemOptionsType } from "primereact/selectitem";
import { searchProceduresUrl } from "@/api/categories";
import { axiosInstance } from "@/api";
import { Button } from "primereact/button";
import { configureUrl } from "@/utils";
import RU_LOCALE from "@/consts/locale";

interface BookingBannerFormModel {
  cities: SelectItemOptionsType[];
}

const BookingBannerForm: FC<BookingBannerFormModel> = ({ cities }) => {
  const router = useRouter();

  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState<null | Date>(null);
  const [filteredProcedures, setFilteredProcedures] = useState([]);

  const searchButtonDisabled = useMemo(
    () =>
      !selectedCity ||
      !selectedDate ||
      !selectedProcedure?.procedureGroupId ||
      !selectedProcedure?.procedureId,
    [selectedProcedure, selectedCity, selectedDate]
  );

  const searchProcedure = useCallback(async (event: any) => {
    const tmp = await axiosInstance(
      searchProceduresUrl.concat(`/${event.query}`)
    );

    setFilteredProcedures(tmp.data);
  }, []);

  const searchButtonClick = useCallback(() => {
    router.push(
      configureUrl("/book", [
        { name: "selectedCityId", value: String(selectedCity) },
        {
          name: "selectedDate",
          value: selectedDate?.toLocaleDateString().replaceAll(".", "/") ?? "",
        },
        {
          name: "categoryId",
          value: String(selectedProcedure?.procedureGroupId),
        },
        { name: "procedureId", value: String(selectedProcedure?.procedureId) },
      ])
    );
  }, [selectedProcedure, selectedCity, selectedDate]);

  addLocale("ru", RU_LOCALE);

  return (
    <>
      <Dropdown
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={cities}
        showClear
        placeholder="Ваш город"
        className="w-full"
      />
      <Calendar
        value={selectedDate}
        onChange={(e: any) => setSelectedDate(e.value)}
        placeholder="Дата записи"
        locale="ru"
        showButtonBar
      />
      <div className="card p-fluid">
        <AutoComplete
          placeholder="Поиск процедур"
          field="procedureName"
          value={selectedProcedure}
          suggestions={filteredProcedures}
          completeMethod={searchProcedure}
          onChange={(e) => setSelectedProcedure(e.value)}
        />
      </div>
      <Button
        severity="secondary"
        disabled={searchButtonDisabled}
        onClick={searchButtonClick}
      >
        Начать поиск
      </Button>
    </>
  );
};

export default BookingBannerForm;
