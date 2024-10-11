import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import { ListBox } from "primereact/listbox";
import { Skeleton } from "primereact/skeleton";

import axiosInstance, { BASE_URL_BACK } from "@/api";
import { getAvailableMastersForProcedureBySaloonAndDateUrl } from "@/api/serviceInstance";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { commonSetUiToast } from "@/store/common/actions";
import Button from "@/components/Button";

import { BookingMaster, ResponseBookingMaster } from "../models";
import styles from "./style.module.scss";

interface BookingMasterStepProps {
  initialState: null | BookingMaster;
  date: Date;
  idSaloon: number;
  idProcedure: number;
  handleApply(arg: BookingMaster): void;
}

const BookingMasterStep: FC<BookingMasterStepProps> = ({
  initialState,
  date,
  idProcedure,
  idSaloon,
  handleApply,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableMasters, setAvailableMasters] = useState<BookingMaster[]>([]);
  const [master, setMaster] = useState<null | BookingMaster>(initialState);
  const dispatch = useDispatch();

  const fetchAvailableMasters = async () => {
    try {
      setIsLoading(true);
      const { data: availableMasters } = await axiosInstance.post(
        getAvailableMastersForProcedureBySaloonAndDateUrl(
          idSaloon,
          idProcedure
        ),
        { date: moment(date).format("DD-MM-yyyy") }
      );

      setAvailableMasters(
        availableMasters.map((availableMaster: ResponseBookingMaster) => ({
          ...availableMaster,
          mainImage: availableMaster.mainImage
            ? BASE_URL_BACK.concat(availableMaster.mainImage)
            : DEFAULT_PROFILE_IMAGE,
        }))
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Запись",
        detail: "Ошибка загрузки доступных мастеров.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const applyForm = () => {
    if (master) {
      handleApply(master);
    }
  };

  const availableMasterTemplate = (option: BookingMaster) => (
    <div className={classNames("flex", "flex-wrap", "justify-content-between", "align-items-center", "gap-3")}>
      <div className={classNames("flex", "align-items-center")}>
        <img
          src={option.mainImage}
          alt={option.mainImage}
          className={classNames(styles.masterAvatar, "h-3rem", "w-3rem", "shadow-2")}
        />
        <p className="ml-2">{option.name}</p>
      </div>

      <p>{option.price} BYN</p>
    </div>
  );

  useEffect(() => {
    fetchAvailableMasters();
  }, []);

  return isLoading ? (
    <Skeleton width="100%" height="10rem" />
  ) : (
    <>
      <ListBox
        value={master}
        onChange={(e) => setMaster(e.value)}
        options={availableMasters}
        itemTemplate={availableMasterTemplate}
        className="w-full"
        emptyMessage="Доступные мастера отсутствуют."
      />
      <Button
        disabled={!master}
        onClick={applyForm}
        className={classNames("mt-2", "w-full")}
      >
        Выбрать
      </Button>
    </>
  );
};

export default BookingMasterStep;
