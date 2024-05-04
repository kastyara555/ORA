"use client";
import { FC } from "react";
import classNames from "classnames";
import { useFormik } from "formik";
import { ListBox } from "primereact/listbox";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

type City = { id: number; name: string };

interface ProcedureCitiesProps {
  procedureId: number;
  cities: City[];
}

interface cityProcedureFormModel {
  city: City | null;
}

const PROCEDURE_CITY_INITIAL_STATE: cityProcedureFormModel = {
  city: null,
};

const ProcedureCities: FC<ProcedureCitiesProps> = ({ cities, procedureId }) => {
  const router = useRouter();

  const formik = useFormik<cityProcedureFormModel>({
    initialValues: PROCEDURE_CITY_INITIAL_STATE,
    validateOnMount: true,
    validate: (data) => {
      console.log(data);
      if (!data.city) {
        return {
          city: "Город должен быть выбран.",
        };
      }

      return {};
    },
    onSubmit: async (data) => {
      router.push(`/${procedureId}/${data.city}`);
    },
  });

  return (
    <form
      className={classNames(
        "pt-2",
        "flex",
        "flex-column",
        "justify-content-between"
      )}
      onSubmit={formik.handleSubmit}
    >
      <ListBox
        filter
        value={formik.values.city}
        onChange={(e) => {
          formik.setFieldValue("city", e.value);
        }}
        options={cities}
        optionValue="id"
        optionLabel="name"
        className="w-full"
        listStyle={{ maxHeight: 256 }}
      />
      <Button
        type="submit"
        disabled={!formik.isValid}
        className={classNames("mt-2", "w-full")}
      >
        Выбрать
      </Button>
    </form>
  );
};

export default ProcedureCities;
