"use client";

import { FC, memo, useState } from "react";
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import classNames from "classnames";
import { useFormik } from "formik";

import {
  AddingMasterForm,
  AddingMasterFormPayload,
  MasterInfoModel,
  ServiceInfoModel,
} from "@/screens/Profile/EditProfile/EditServiceScreen/types";
import Button from "@/components/Button";

import styles from "./style.module.scss";

const INITIAL_ADDING_MASTER_FORM: AddingMasterForm = {
  price: null,
  master: null,
};

interface EditServiceAddMasterFormProps {
  serviceInfo: ServiceInfoModel;
  onSubmit: ({ id, price }: AddingMasterFormPayload) => void;
}

const EditServiceAddMasterForm: FC<EditServiceAddMasterFormProps> = ({
  serviceInfo,
  onSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const masterOptionTemplate = (option: MasterInfoModel) => (
    <div className="flex align-items-center">
      <img
        src={option.mainImage}
        alt={option.mainImage}
        className={classNames(
          styles.masterAvatar,
          "h-4rem",
          "shadow-2",
          "mr-2"
        )}
      />
      <div>
        ({option.id})&nbsp;{option.name}&nbsp;{option.email}
      </div>
    </div>
  );

  const selectedMasterTemplate = (
    option: MasterInfoModel | null,
    props: DropdownProps
  ) =>
    option ? masterOptionTemplate(option) : <span>{props.placeholder}</span>;

  const handleAddMaster = (e: DropdownChangeEvent) => {
    formik.setFieldValue("master", e.value);
  };

  const handlePriceChange = (e: InputNumberChangeEvent) => {
    formik.setFieldValue("price", e.value);
  };

  const formik = useFormik<AddingMasterForm>({
    initialValues: INITIAL_ADDING_MASTER_FORM,
    validateOnMount: true,
    validate: (data) => {
      const errors: any = {};

      if (!data.master) {
        errors.master = "Заполните поле мастера.";
      }

      if (!data.price || data.price <= 0) {
        errors.price = "Введите реальную стоимость оказания услуги.";
      }

      return errors;
    },
    onSubmit: async (data) => {
      if (data.master && data.price) {
        setLoading(true);
        await onSubmit({ id: data.master.id, price: data.price });
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
      <div className={classNames("col-12", "xl:col-6", "lg:col-6", "py-4")}>
        <label htmlFor="availableMasters">Доступные мастера</label>
        <Dropdown
          filter
          optionLabel="name"
          id="availableMasters"
          onChange={handleAddMaster}
          value={formik.values.master}
          placeholder="Выберите мастера"
          itemTemplate={masterOptionTemplate}
          options={serviceInfo.availableMasters}
          valueTemplate={selectedMasterTemplate}
          className={classNames("w-full", "mt-2")}
          disabled={!serviceInfo.availableMasters.length}
        />
      </div>
      <div className={classNames("col-12", "xl:col-6", "lg:col-6", "py-4")}>
        <label htmlFor="price">Стоимость</label>
        <InputNumber
          min={0}
          id="price"
          className={classNames("w-full", "mt-2")}
          value={formik.values.price}
          onChange={handlePriceChange}
          disabled={!serviceInfo.availableMasters.length}
        />
      </div>
      <div className={classNames("col-12", "xl:col-6", "lg:col-6")}>
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
      <div className={classNames("col-12", "xl:col-6", "lg:col-6")}>
        <Button
          disabled={!formik.isValid || !formik.dirty}
          type="submit"
          className="w-full"
        >
          Добавить
        </Button>
      </div>
    </form>
  );
};

export default memo(EditServiceAddMasterForm);
