import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import { ListBox } from "primereact/listbox";
import { Skeleton } from "primereact/skeleton";

import axiosInstance from "@/api";
import { getAvailableDatesBySaloonAndProcedureUrl } from "@/api/serviceInstance";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import Button from "@/components/Button";

interface BookingDateStepProps {
  initialState: null | Date;
  month: number;
  year: number;
  idSaloon: number;
  idProcedure: number;
  handleApply(arg: Date): void;
}

const BookingDateStep: FC<BookingDateStepProps> = ({
  initialState,
  month,
  year,
  idProcedure,
  idSaloon,
  handleApply,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [date, setDate] = useState<null | Date>(initialState);
  const dispatch = useDispatch();

  const fetchAvailableDates = async () => {
    try {
      setIsLoading(true);
      const { data: availableDates } = await axiosInstance.post(
        getAvailableDatesBySaloonAndProcedureUrl(idSaloon, idProcedure),
        { month, year }
      );

      setAvailableDates(availableDates.map((date: string) => new Date(date)));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Запись",
        detail: "Ошибка загрузки доступных дат.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const applyForm = () => {
    if (date) {
      handleApply(date);
    }
  };

  const availableDateTemplate = (option: Date) => {
    const dayName = option.toLocaleDateString("ru-RU", {
      weekday: "long",
    });
    const formattedDayName = dayName[0].toUpperCase().concat(dayName.slice(1));

    const formattedDate = moment(option).format("DD.MM.yyyy");

    return (
      <p>
        {formattedDate}&nbsp;({formattedDayName})
      </p>
    );
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  return isLoading ? (
    <Skeleton width="100%" height="10rem" />
  ) : (
    <>
      <ListBox
        value={date}
        onChange={(e) => setDate(e.value)}
        options={availableDates}
        itemTemplate={availableDateTemplate}
        className="w-full"
        emptyMessage="Доступные даты отсутствуют."
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

export default BookingDateStep;
