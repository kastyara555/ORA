import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import { ListBox } from "primereact/listbox";
import { Skeleton } from "primereact/skeleton";

import axiosInstance from "@/api";
import { getAvailableRecordsForProcedureBySaloonDateAndMasterUrl } from "@/api/serviceInstance";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import Button from "@/components/Button";

import { BookingRecord } from "../models";

interface BookingTimeStepProps {
  initialState: null | BookingRecord;
  date: Date;
  idMaster: number;
  idSaloon: number;
  idProcedure: number;
  handleApply(arg: BookingRecord): void;
}

const BookingTimeStep: FC<BookingTimeStepProps> = ({
  initialState,
  date,
  idMaster,
  idProcedure,
  idSaloon,
  handleApply,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableRecords, setAvailableRecords] = useState<Date[]>([]);
  const [record, setRecord] = useState<null | BookingRecord>(initialState);
  const dispatch = useDispatch();

  const fetchAvailableRecords = async () => {
    try {
      setIsLoading(true);
      const { data: availableRecords } = await axiosInstance.post(
        getAvailableRecordsForProcedureBySaloonDateAndMasterUrl(
          idSaloon,
          idProcedure
        ),
        { date: moment(date).format("DD-MM-yyyy"), masterId: idMaster }
      );

      setAvailableRecords(availableRecords);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Запись",
        detail: "Ошибка загрузки доступных окон для записи.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const applyForm = () => {
    if (record) {
      handleApply(record);
    }
  };

  useEffect(() => {
    fetchAvailableRecords();
  }, []);

  return isLoading ? (
    <Skeleton width="100%" height="10rem" />
  ) : (
    <>
      <ListBox
        value={record}
        onChange={(e) => setRecord(e.value)}
        options={availableRecords}
        optionLabel="time"
        className="w-full"
        emptyMessage="Доступные окна для записи отсутствуют."
      />
      <Button
        disabled={!record}
        onClick={applyForm}
        className={classNames("mt-2", "w-full")}
      >
        Выбрать
      </Button>
    </>
  );
};

export default BookingTimeStep;
