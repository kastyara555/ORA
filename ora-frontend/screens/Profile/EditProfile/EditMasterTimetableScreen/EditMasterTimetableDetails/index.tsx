"use client";

import { FC, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import { Panel } from "primereact/panel";
import moment from "moment";

import axiosInstance from "@/api";
import { masterTimetableUrl } from "@/api/master";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";

import { CreateServiceSaloonModel } from "./types";
import CreateServiceForm from "./CreateServiceForm";

interface TimetableDetails {
  timetable: any[];
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
      <div className={classNames("col-12", "py-4", "lg:col-8", "xl:col-8")}>
        <Panel header="Создание записей" className="w-full">
          <CreateServiceForm saloons={timetableDetails.saloons} />
        </Panel>
      </div>
      <div className={classNames("col-12", "py-4", "lg:col-4", "xl:col-4")}>
        <Panel header="Актуальные записи" className="w-full"></Panel>
      </div>
    </div>
  );
};

export default EditMasterTimetableDetails;
