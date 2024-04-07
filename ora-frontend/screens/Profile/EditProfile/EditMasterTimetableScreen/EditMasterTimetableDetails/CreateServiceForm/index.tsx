"use client";

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
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Button as ButtonPrimeReact } from "primereact/button";

import Button from "@/components/Button";
import axiosInstance, { BASE_URL } from "@/api";
import { masterServices } from "@/api/master";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import { profileUserDataSelector } from "@/store/profile/selectors";

import { CreateServiceFormModel, CreateServiceSaloonModel } from "../types";

import styles from "./style.module.scss";

const INITIAL_CREATE_SERVICE_FORM: CreateServiceFormModel = {
  saloon: null,
  service: null,
  time: null,
};

interface CreateServiceFormProps {
  saloons: CreateServiceSaloonModel[];
  onSubmit: (formData: CreateServiceFormModel) => void;
}

const CreateServiceForm: FC<CreateServiceFormProps> = ({
  saloons,
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
            ? BASE_URL.concat(option.mainImage)
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

  const handleSetTime = (e: CalendarChangeEvent) => {
    formik.setFieldValue("time", e.value);
  };

  const clearTime = () => {
    formik.setFieldValue("time", null);
  };

  const formik = useFormik<CreateServiceFormModel>({
    initialValues: INITIAL_CREATE_SERVICE_FORM,
    validateOnMount: true,
    validate: (data) => {
      const errors: any = {};

      if (!data.saloon) {
        errors.saloon = "Заполните поле салона.";
      }

      if (!data.service) {
        errors.service = "Заполните поле сервиса.";
      }

      if (!data.time) {
        errors.time = "Заполните поле времени.";
      }

      return errors;
    },
    onSubmit: async (formData) => {
      await onSubmit(formData);
      formik.resetForm();
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
      formik.setFieldValue("service", null);
      formik.setFieldValue("time", null);
    }
  }, [formik.values.saloon]);

  useEffect(() => {
    if (!formik.values.service) {
      formik.setFieldValue("time", null);
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
              showClear
            />
          </div>

          {!!formik.values.service && (
            <div className={classNames("col-12", "pt-2")}>
              <label htmlFor="serviceTime">Время</label>
              <br />
              <div className={classNames("mt-2", "w-full", "flex")}>
                <Calendar
                  id="serviceTime"
                  className="w-full"
                  value={formik.values.time}
                  onChange={handleSetTime}
                  timeOnly
                />
                <ButtonPrimeReact
                  outlined
                  disabled={!formik.values.time}
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
