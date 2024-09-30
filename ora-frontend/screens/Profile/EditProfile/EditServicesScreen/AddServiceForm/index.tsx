import { FC, memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

import { HOURS_PROCEDURE, MINUTES_PROCEDURE } from "@/consts/registration";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import { searchProceduresUrl } from "@/api/categories";
import { addSaloonServicesUrl } from "@/api/saloon";
import axiosInstance from "@/api";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface TimeModel {
  code: string;
  name: string;
}

interface AddServiceFormModel {
  procedure: any;
  hours: TimeModel | null;
  minutes: TimeModel | null;
  description: string;
}

interface AddServiceFormProps {
  setServices: any;
}

const INITIAL_STATE: AddServiceFormModel = {
  procedure: null,
  hours: null,
  minutes: null,
  description: "",
};

const timeSchema = object({
  code: string(),
  name: string(),
});

const serviceSchema = object({
  procedure: object({
    procedureGroupId: number(),
    procedureId: number(),
    procedureName: string(),
  }),
  hours: timeSchema,
  minutes: timeSchema,
  description: string().trim().max(256).notRequired(),
});

const AddServiceForm: FC<AddServiceFormProps> = ({ setServices }) => {
  const dispatch = useDispatch();
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validateOnMount: true,
    validate: (data) => {
      try {
        serviceSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      return {};
    },
    onSubmit: async (data) => {
      const payload = {
        services: [
          {
            procedureId: data.procedure.procedureId,
            hours: +(data.hours as TimeModel).code,
            minutes: +(data.minutes as TimeModel).code,
            description: data.description,
          },
        ],
      };

      setLoading(true);

      await axiosInstance
        .post(addSaloonServicesUrl(userTypeMapId), payload)
        .then(({ data }) => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.SUCCESS,
            summary: "Профиль",
            detail: "Услуга успешно добавлена.",
            life: TOAST_DEFAULT_LIFE,
          };

          setServices(data);
          dispatch(commonSetUiToast(toastToBeShown));
          formik.resetForm();
        })
        .catch(({ response }) => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.ERROR,
            summary: "Профиль",
            detail: response.data,
            life: TOAST_DEFAULT_LIFE,
          };

          dispatch(commonSetUiToast(toastToBeShown));
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const searchProcedure = useCallback(async (event: any) => {
    const response = await axiosInstance.post(
      searchProceduresUrl.concat(`/${event.query}`),
      {}
    );

    setFilteredProcedures(response.data);
  }, []);

  return loading ? (
    <Skeleton width="100%" height="340px" />
  ) : (
    <form
      className={classNames(styles.container, "grid")}
      onSubmit={formik.handleSubmit}
    >
      <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
        <label className={styles.lightText} htmlFor="procedure">
          Процедура
        </label>
        <AutoComplete
          className={classNames("p-0", "pt-1", "col-12")}
          inputClassName="w-full"
          placeholder="Поиск процедур"
          field="procedureName"
          value={formik.values.procedure}
          suggestions={filteredProcedures}
          completeMethod={searchProcedure}
          onChange={(e) => {
            formik.setFieldValue("procedure", e.value);
          }}
        />
      </div>
      <div
        className={classNames(
          "col-12",
          "lg:col-6",
          "xl:col-6",
          "flex",
          "align-items-end"
        )}
      >
        <div
          className={classNames("flex", "flex-column", "jusify-content-end")}
        >
          <label className={styles.lightText} htmlFor="hours">
            Часов
          </label>
          <Dropdown
            id="hours"
            className="mt-1"
            options={HOURS_PROCEDURE}
            value={formik.values.hours}
            onChange={(e) => {
              formik.setFieldValue("hours", e.value);
            }}
            optionLabel="name"
          />
        </div>
        <div
          className={classNames(
            "flex",
            "flex-column",
            "jusify-content-end",
            "pl-1",
            "p-0"
          )}
        >
          <label className={styles.lightText} htmlFor="minutes">
            Минут
          </label>
          <Dropdown
            id="minutes"
            className="mt-1"
            options={MINUTES_PROCEDURE}
            value={formik.values.minutes}
            onChange={(e) => {
              formik.setFieldValue("minutes", e.value);
            }}
            optionLabel="name"
          />
        </div>
      </div>
      <div className="col-12">
        <label className={styles.lightText} htmlFor="description">
          Описание (опционально)
        </label>
        <InputTextarea
          id="description"
          className={classNames(styles.input, "w-full", "mt-1")}
          value={formik.values.description}
          onChange={(e) => formik.setFieldValue("description", e.target.value)}
          maxLength={256}
          rows={3}
        />
      </div>
      <div className={classNames("col-12", "mt-2")}>
        <Button type="submit" disabled={!formik.isValid} className="w-full" size="small">
          Добавить
        </Button>
      </div>
    </form>
  );
};

export default memo(AddServiceForm);
