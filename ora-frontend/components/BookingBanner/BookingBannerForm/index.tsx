import { FC, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import cn from "classnames";

import { searchProceduresUrl } from "@/api/categories";
import axiosInstance from "@/api";
import Button from "@/components/Button";

import styles from "./style.module.scss";

// interface BookingBannerFormModel {
//   cities: SelectItemOptionsType[];
// }

interface BookingBannerFormProps {
  className?: string;
}

// TODO: Когда будет много салонов в городах, разблокировать выбор города для процедуры
const BookingBannerForm: FC<BookingBannerFormProps> = ({ className }) => {
  const router = useRouter();

  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  // const [selectedCity, setSelectedCity] = useState(null);
  const [filteredProcedures, setFilteredProcedures] = useState([]);

  const searchButtonDisabled = useMemo(
    () =>
      !selectedProcedure?.procedureGroupId || !selectedProcedure?.procedureId,
    [selectedProcedure]
  );

  const searchProcedure = useCallback(async (event: AutoCompleteCompleteEvent) => {
    const { data } = await axiosInstance.post(
      searchProceduresUrl.concat(`/${event.query}`),
      {}
    );

    setFilteredProcedures(data);
  }, []);

  const searchButtonClick = useCallback(() => {
    // if (selectedCity) {
    //   router.push(
    //     `/procedures/${selectedProcedure?.procedureId}/${selectedCity}`
    //   );
    // } else {
    router.push(`/procedures/${selectedProcedure?.procedureId}`);
    // }
  }, [selectedProcedure]);

  return (
    <>
      <div className={cn(className, "card", "p-fluid")}>
        <AutoComplete
          placeholder="Поиск процедур"
          field="procedureName"
          value={selectedProcedure}
          suggestions={filteredProcedures}
          panelClassName={styles.autocomplete}
          completeMethod={searchProcedure}
          onChange={(e) => setSelectedProcedure(e.value)}
        />
      </div>
      {/* <Dropdown
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={cities}
        showClear
        placeholder="Ваш город"
        className="w-full"
      /> */}
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
