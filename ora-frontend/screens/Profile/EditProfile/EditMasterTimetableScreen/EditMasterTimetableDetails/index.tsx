"use client";

import { FC, useLayoutEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { ScrollPanel } from "primereact/scrollpanel";
import { Skeleton } from "primereact/skeleton";
import { Panel } from "primereact/panel";
import { AxiosError } from "axios";
import moment from "moment";

import axiosInstance from "@/api";
import { DAYS_OF_WEEK } from "@/consts";
import {
  cancelMasterServiceInstance,
  createMasterServiceInstance,
  masterTimetableUrl,
} from "@/api/master";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";

import {
  CreateServiceFormModel,
  CreateServiceSaloonModel,
  CreateServiceTimetableModel,
} from "./types";
import CreateServiceForm from "./CreateServiceForm";
import RecordsList from "./RecordsList";

interface TimetableDetails {
  timetable: CreateServiceTimetableModel[];
  saloons: CreateServiceSaloonModel[];
}

interface EditMasterTimetableDetailsProps {
  date: moment.Moment;
}

const EditMasterTimetableDetails: FC<EditMasterTimetableDetailsProps> = ({
  date,
}) => {
  const dispatch = useDispatch();
  const { userTypeMapId } = useSelector(profileUserDataSelector);

  const [timetableDetails, setTimetableDetails] =
    useState<null | TimetableDetails>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dateIsValid = date.isValid();
  const isActual = date.isSameOrAfter(moment(), "day");

  const dayName = useMemo(() => {
    const day = date.day();

    return Object.values(DAYS_OF_WEEK)[day ? day - 1 : 6];
  }, [date]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        masterTimetableUrl(userTypeMapId, date.format("DD-MM-YYYY"))
      );

      setTimetableDetails(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Расписание",
        detail: "Ошибка загрузки расписания",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  const postNewServiceInstance = async (formData: CreateServiceFormModel) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        createMasterServiceInstance(userTypeMapId),
        {
          id: formData.service?.id,
          hours: formData.time?.getHours(),
          minutes: formData.time?.getMinutes(),
          date: date.format("DD-MM-YYYY"),
        }
      );

      setTimetableDetails(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Расписание",
        detail: (e as AxiosError)?.response?.data ?? "Ошибка создания записи",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  const cancelServiceInstance = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        cancelMasterServiceInstance(userTypeMapId, id)
      );

      setTimetableDetails(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Расписание",
        detail: (e as AxiosError)?.response?.data ?? "Ошибка удаления записи",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchTimetableData();
  }, []);

  if (!dateIsValid) {
    return (
      <div className="grid">
        <div className={classNames("col-12", "py-4")}>
          <h3>Указана невалидная дата.</h3>
        </div>
      </div>
    );
  }

  if (!isActual) {
    return (
      <div className="grid">
        <div className={classNames("col-12", "py-4")}>
          <h3>
            Составлять расписание можно только для сегодня и будущих дней.
          </h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Skeleton width="100%" height="486px" />;
  }

  if (!timetableDetails) {
    return (
      <div className="grid">
        <div className={classNames("col-12", "py-4")}>
          <h3>
            У Вас нет активных услуг. Обратитесь в Ваш салон, для того, чтобы
            Вас добавили в качестве мастера для выполнения услуг согласно Вашему
            профилю.
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <Panel header="Дата" className={classNames("col-12", "pt-4")}>
        <h3>
          {date.format("DD-MM-YYYY")} ({dayName})
        </h3>
      </Panel>
      <Panel
        header="Создание записей"
        className={classNames("col-12", "pt-2", "lg:col-8", "xl:col-8")}
      >
        <CreateServiceForm
          saloons={timetableDetails.saloons}
          onSubmit={postNewServiceInstance}
        />
      </Panel>
      <div className={classNames("col-12", "pt-2", "lg:col-4", "xl:col-4")}>
        <ScrollPanel style={{ height: 512 }}>
          <RecordsList
            serviceInstances={timetableDetails.timetable ?? []}
            onCancel={cancelServiceInstance}
          />
        </ScrollPanel>
      </div>
    </div>
  );
};

export default EditMasterTimetableDetails;
