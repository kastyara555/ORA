import { FC, memo, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button as ButtonPrimeReact } from "primereact/button";

import Button from "@/components/Button";
import axiosInstance, { BASE_STATIC_URL } from "@/api";
import { masterServices } from "@/api/master";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { HOURS_SALOON, MINUTES_SALOON } from "@/consts/saloon";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import { profileUserDataSelector } from "@/store/profile/selectors";

import { CreateServiceFormModel, CreateServiceSaloonModel } from "../types";

import styles from "./style.module.scss";

const INITIAL_CREATE_SERVICE_FORM: CreateServiceFormModel = {
  saloon: null,
  service: null,
  hours: HOURS_SALOON[0],
  minutes: MINUTES_SALOON[0],
};

interface CreateServiceFormProps {
  saloons: CreateServiceSaloonModel[];
  disabled: boolean;
  onSubmit: (formData: CreateServiceFormModel) => void;
}

const CreateServiceForm: FC<CreateServiceFormProps> = ({
  saloons,
  disabled,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<any[]>([]);

  const saloonOptionTemplate = (option: CreateServiceSaloonModel) => (
    <div className="flex align-items-center">
      <img
        src={
          option.mainImage
            ? BASE_STATIC_URL.concat(option.mainImage)
            : DEFAULT_PROFILE_IMAGE
        }
        alt={option.mainImage ?? "Главное изображение салона"}
        className={classNames(
          styles.saloonAvatar,
          "h-3rem",
          "w-3rem",
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

  const handleAddService = (e: DropdownChangeEvent) => {
    formik.setFieldValue("service", e.value);
  };

  const handleSetHours = (e: DropdownChangeEvent) => {
    formik.setFieldValue("hours", e.value);
  };

  const handleSetMinutes = (e: DropdownChangeEvent) => {
    formik.setFieldValue("minutes", e.value);
  };

  const clearTime = () => {
    formik.setFieldValue("hours", INITIAL_CREATE_SERVICE_FORM.hours);
    formik.setFieldValue("minutes", INITIAL_CREATE_SERVICE_FORM.minutes);
  };

  const formik = useFormik<CreateServiceFormModel>({
    initialValues: INITIAL_CREATE_SERVICE_FORM,
    validateOnMount: true,
    validate: (data) => {
      const errors: Record<string, string> = {};

      if (!data.saloon) {
        errors.saloon = "Заполните поле салона.";
      }

      if (!data.service) {
        errors.service = "Заполните поле сервиса.";
      }

      if (
        data.hours?.code === INITIAL_CREATE_SERVICE_FORM.hours?.code &&
        data.minutes?.code === INITIAL_CREATE_SERVICE_FORM.minutes?.code
      ) {
        errors.time = "Заполните поле времени.";
      }

      return errors;
    },
    onSubmit: async (formData) => {
      await onSubmit(formData);
      clearTime();
    },
  });

  const fetchServicesBySaloon = async () => {
    try {
      setLoading(true);
      if (formik.values.saloon) {
        const { data } = await axiosInstance.get(
          masterServices(userTypeMapId, formik.values.saloon.id)
        );

        setServices(data.services);
      }
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Расписание",
        detail: "Ошибка загрузки услуг",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formik.values.saloon) {
      fetchServicesBySaloon();
    } else {
      setServices([]);
      formik.setFieldValue("service", INITIAL_CREATE_SERVICE_FORM.service);
      clearTime();
    }
  }, [formik.values.saloon]);

  useEffect(() => {
    if (!formik.values.service) {
      clearTime();
    }
  }, [formik.values.service]);

  if (loading) {
    return <Skeleton width="100%" height="256px" className="my-4" />;
  }

  return (
    <form
      className={classNames("w-full", "grid")}
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      <div className={classNames("col-12", "pt-4")}>
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
          disabled={disabled}
          showClear
        />
      </div>

      {!!formik.values.saloon && (
        <>
          <div className={classNames("col-12", "pt-2")}>
            <label htmlFor="servicesInSaloon">Сервисы</label>
            <Dropdown
              filter
              optionLabel="name"
              id="servicesInSaloon"
              onChange={handleAddService}
              value={formik.values.service}
              placeholder="Выберите сервис"
              options={services}
              className={classNames("w-full", "mt-2")}
              disabled={disabled}
              showClear
            />
          </div>

          {!!formik.values.service && (
            <div className={classNames("col-12", "pt-2")}>
              <label htmlFor="serviceTime">Время</label>
              <br />
              <div className={classNames("mt-2", "w-full", "flex")}>
                <div className={classNames("flex", "flex-1", "gap-2")}>
                  <div className={classNames("flex", "align-items-center")}>
                    <Dropdown
                      options={HOURS_SALOON}
                      value={formik.values.hours}
                      onChange={handleSetHours}
                      disabled={disabled}
                      optionLabel="name"
                    />
                    &nbsp;<h3>ч.</h3>
                  </div>
                  <div
                    className={classNames("flex", "align-items-center", "p-0")}
                  >
                    <Dropdown
                      options={MINUTES_SALOON}
                      value={formik.values.minutes}
                      onChange={handleSetMinutes}
                      disabled={disabled}
                      optionLabel="name"
                    />
                    &nbsp;<h3>мин.</h3>
                  </div>
                </div>

                <ButtonPrimeReact
                  outlined
                  disabled={!formik.values.hours || !formik.values.minutes || disabled}
                  onClick={clearTime}
                  icon="pi pi-times"
                  severity="danger"
                  aria-label="Очистить время"
                  size="small"
                  className="ml-1"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className={classNames("col-12", "mt-4")}>
        <Button
          disabled={!formik.dirty || disabled}
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
          disabled={!formik.isValid || !formik.dirty || disabled}
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
