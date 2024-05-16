import { FC, useState } from "react";
import classNames from "classnames";
import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";

import RU_LOCALE from "@/consts/locale";
import Button from "@/components/Button";

interface BookingMonthStepProps {
  initialState: null | Date;
  handleApply(arg: Date): void;
}

const BookingMonthStep: FC<BookingMonthStepProps> = ({
  initialState,
  handleApply,
}) => {
  const [date, setDate] = useState<null | Date>(initialState);

  addLocale("ru", RU_LOCALE);

  const applyForm = () => {
    if (date) {
      handleApply(date);
    }
  };

  return (
    <>
      <Calendar
        value={date}
        onChange={(e: any) => setDate(e.value)}
        placeholder="Выберите месяц"
        className="w-full"
        locale="ru"
        view="month"
        dateFormat="MM yy"
        minDate={new Date()}
      />
      <Button
        disabled={!date}
        onClick={applyForm}
        className={classNames("mt-2", "w-full")}
      >
        Выбрать
      </Button>
    </>
  );
};

export default BookingMonthStep;
