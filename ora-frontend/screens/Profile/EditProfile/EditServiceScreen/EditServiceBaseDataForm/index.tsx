"use client";

import { ChangeEvent, FC, memo, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import classNames from "classnames";
import { useFormik } from "formik";
import { object, string } from "yup";
import { Skeleton } from "primereact/skeleton";

import Button from "@/components/Button";
import {
  ServiceBaseDataForm,
  ServiceInfoModel,
} from "@/screens/Profile/EditProfile/EditServiceScreen/types";

import styles from "./style.module.scss";

interface EditServiceBaseDataFormProps {
  serviceInfo: ServiceInfoModel;
  onSubmit: (payload: ServiceBaseDataForm) => void;
}

const serviceBaseDataSchema = object({
  description: string().trim().max(256),
});

const EditServiceBaseDataForm: FC<EditServiceBaseDataFormProps> = ({
  serviceInfo,
  onSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<ServiceBaseDataForm>({
    enableReinitialize: true,
    initialValues: { description: serviceInfo.description },
    validate: (data) => {
      const errors: any = {};

      try {
        serviceBaseDataSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      return errors;
    },
    onSubmit: async (data) => {
      setLoading(true);
      await onSubmit(data);
      setLoading(false);
    },
  });

  const setDescription = (e: ChangeEvent) => {
    formik.setFieldValue("description", (e.target as HTMLInputElement).value);
  };

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
        <label className={styles.lightText} htmlFor="description">
          Описание (опционально)
        </label>
        <InputTextarea
          id="description"
          className={classNames(styles.input, "w-full", "mt-2")}
          onChange={setDescription}
          value={formik.values.description}
          maxLength={256}
          rows={3}
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
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default memo(EditServiceBaseDataForm);
