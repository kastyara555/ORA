import { FC, useRef, useState } from "react";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import moment from "moment";

import RU_LOCALE from "@/consts/locale";
import Button from "@/components/Button";

const ProfileTimeTableSelectDateScreen: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const minDate = useRef(new Date());
  const router = useRouter();

  const selectDate = () => {
    router.push(
      `/profile/timetable/${moment(selectedDate.toISOString()).format(
        "DD-MM-YYYY"
      )}`
    );
  };

  addLocale("ru", RU_LOCALE);

  return (
    <div className={classNames("grid", "py-4")}>
      <div className={classNames("col-12", "py-2")}>
        <h2>Дата:</h2>
        <Calendar
          value={selectedDate}
          onChange={(e: CalendarChangeEvent) => setSelectedDate(e.value as Date)}
          className={classNames("w-full", "pt-2")}
          placeholder="Дата"
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

export default ProfileTimeTableSelectDateScreen;
