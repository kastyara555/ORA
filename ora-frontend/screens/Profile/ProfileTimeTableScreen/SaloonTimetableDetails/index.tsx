
import { FC, memo, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Skeleton } from "primereact/skeleton";

import axiosInstance from "@/api";
import { DAYS_OF_WEEK } from "@/consts";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import Timetable, { TimetableMasterModel } from "@/components/Timetable";
import { commonSetUiToast } from "@/store/common/actions";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { saloonTimetableUrl } from "@/api/saloon";
import { SaloonProfileModel } from "@/models/profile";

interface SaloonTimetableDetailsProps {
  date: moment.Moment;
}

const SaloonTimetableDetails: FC<SaloonTimetableDetailsProps> = ({ date }) => {
  const dispatch = useDispatch();
  const { userTypeMapId, workingTime } = useSelector(profileUserDataSelector) as SaloonProfileModel;

  const [timetableDetails, setTimetableDetails] = useState<TimetableMasterModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dateIsValid = date.isValid();
  const isActual = date.isSameOrAfter(moment(), "day");

  const dayOfWeek = useMemo(() => {
    const day = date.day();

    return Object.entries(DAYS_OF_WEEK)[day ? day - 1 : 6];
  }, [date]);

  const timeTable = useMemo(() => JSON.parse(workingTime)[dayOfWeek[0]], [workingTime, dayOfWeek]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        saloonTimetableUrl(userTypeMapId, date.format("DD-MM-YYYY"))
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
    return <h3 className="py-4">Указана невалидная дата.</h3>;
  }

  if (!isActual) {
    return <h3 className="py-4">Составлять расписание можно только для сегодня и будущих дней.</h3>;
  }

  if (loading) {
    return <Skeleton width="100%" height="486px" />;
  }

  if (!timetableDetails.length) {
    return <h3 className="py-4">На данный день у Вас отсутствует расписание.</h3>;
  }

  return <div>
    <Timetable
      timetable={timetableDetails}
      title={`${date.format('DD-MM-YYYY')}, ${dayOfWeek[1]}`}
      showFromHour={timeTable.startHour}
      showToHour={timeTable.finishMinute ? timeTable.finishHour + timeTable.finishMinute : timeTable.finishHour}
    />
  </div>
};

export default memo(SaloonTimetableDetails);
