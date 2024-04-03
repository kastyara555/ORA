"use client";

import { FC, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import moment from "moment";

import axiosInstance from "@/api";
import { masterCheckTimetableAvailabilityUrl } from "@/api/master";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import RU_LOCALE from "@/consts/locale";
import Button from "@/components/Button";

interface MasterTimetableAvailability {
  isTimetableAvailable: boolean;
}

const EditMasterTimetableScreen: FC = () => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [timetableState, setTimetableState] =
    useState<MasterTimetableAvailability | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const minDate = useRef(new Date());
  const router = useRouter();

  const dispatch = useDispatch();

  const fetchTimetableData = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(
        masterCheckTimetableAvailabilityUrl(userTypeMapId)
      );

      setTimetableState(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Расписание",
        detail: "Ошибка получения информации о расписании",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  const selectDate = () => {
    router.push(
      `/profile/timetable/${moment(selectedDate.toISOString()).format(
        "DD-MM-YYYY"
      )}`
    );
  };

  useLayoutEffect(() => {
    fetchTimetableData();
  }, []);

  addLocale("ru", RU_LOCALE);

  if (loading) {
    return <Skeleton width="100%" height="512px" className="my-4" />;
  }

  if (!timetableState) {
    return (
      <div className="grid">
        <div className={classNames("col-12", "py-4")}>
          <h3>Информация о расписании недоступна.</h3>
        </div>
      </div>
    );
  }

  if (!timetableState.isTimetableAvailable) {
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
    <div className={classNames("grid", "py-4")}>
      <div className={classNames("col-12", "py-2")}>
        <h2>Дата записи:</h2>
        <Calendar
          value={selectedDate}
          onChange={(e: any) => setSelectedDate(e.value)}
          className={classNames("w-full", "pt-2")}
          placeholder="Дата записи"
          locale="ru"
          minDate={minDate.current}
          inline
        />
      </div>
      <div className={classNames("col-12")}>
        <Button
          className={classNames("w-full", "flex", "justify-content-center")}
          onClick={selectDate}
        >
          Выбрать дату
        </Button>
      </div>
    </div>
  );
};

export default EditMasterTimetableScreen;
