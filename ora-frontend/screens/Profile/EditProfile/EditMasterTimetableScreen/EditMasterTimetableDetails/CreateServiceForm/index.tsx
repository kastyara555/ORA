"use client";

import { FC, memo, useState } from "react";
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";
import { useFormik } from "formik";

import Button from "@/components/Button";
import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import { CreateServiceFormModel, CreateServiceSaloonModel } from "../types";

import styles from "./style.module.scss";

const INITIAL_CREATE_SERVICE_FORM: CreateServiceFormModel = {
  saloon: null,
};

interface CreateServiceFormProps {
  saloons: CreateServiceSaloonModel[];
}

const CreateServiceForm: FC<CreateServiceFormProps> = ({
  saloons,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const saloonOptionTemplate = (option: CreateServiceSaloonModel) => (
    <div className="flex align-items-center">
      <img
        src={
          option.mainImage
            ? BASE_URL.concat(option.mainImage)
            : DEFAULT_PROFILE_IMAGE
        }
        alt={option.mainImage ?? "Главное изображение салона"}
        className={classNames(
          styles.saloonAvatar,
          "h-4rem",
          "w-4rem",
          "shadow-2",
          "mr-2"
        )}
      />
      <div>{option.name}</div>
    </div>
  );

  const selectedSaloonTemplate = (
    option: CreateServiceSaloonModel | null,
    props: DropdownProps
  ) =>
    option ? saloonOptionTemplate(option) : <span>{props.placeholder}</span>;

  const handleAddSaloon = (e: DropdownChangeEvent) => {
    formik.setFieldValue("saloon", e.value);
  };

  const formik = useFormik<CreateServiceFormModel>({
    initialValues: INITIAL_CREATE_SERVICE_FORM,
    validateOnMount: true,
    validate: (data) => {
      const errors: any = {};

      if (!data.saloon) {
        errors.saloon = "Заполните поле салона.";
      }

      return errors;
    },
    onSubmit: async (data) => {
      if (data.saloon) {
        setLoading(true);
        formik.resetForm();
        setLoading(false);
      }
    },
  });

  if (loading) {
    return <Skeleton width="100%" height="256px" className="my-4" />;
  }

  return (
    <form
      className={classNames("w-full", "grid")}
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className={classNames("col-12", "py-4")}>
        <label htmlFor="availableSaloons">Доступные салоны</label>
        <Dropdown
          filter
          optionLabel="name"
          id="availableSaloons"
          onChange={handleAddSaloon}
          value={formik.values.saloon}
          placeholder="Выберите салон"
          itemTemplate={saloonOptionTemplate}
          options={saloons}
          valueTemplate={selectedSaloonTemplate}
          className={classNames("w-full", "mt-2")}
          showClear
        />
      </div>
      <div className="col-12">
        <Button
          disabled={!formik.dirty}
          type="reset"
          className="w-full"
          severity="secondary"
          outlined
        >
          Сбросить
        </Button>
      </div>
      <div className="col-12">
        <Button
          disabled={!formik.isValid || !formik.dirty}
          type="submit"
          className="w-full"
        >
          Создать запись
        </Button>
      </div>
    </form>
  );
};

export default memo(CreateServiceForm);
