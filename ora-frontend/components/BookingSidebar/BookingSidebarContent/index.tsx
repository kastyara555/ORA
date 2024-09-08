import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton";
import { MessageSeverity } from "primereact/api";
import { ProgressBar } from "primereact/progressbar";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";

import axiosInstance from "@/api";
import { saloonBaseInfoUrl } from "@/api/saloon";
import { bookServiceInstanceUrl, loginBookServiceInstanceUrl } from "@/api/serviceInstance";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { BookingSidebarDataModel } from "@/store/common/model";
import Button from "@/components/Button";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import {
  commonSetBookingModalData,
  commonSetUiToast,
} from "@/store/common/actions";
import { profileGetInfo } from "@/store/profile/actions";
import { setCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import { SaloonBaseDataModel } from "@/models/saloon";

import { SIDEBAR_PROGRESS_LIST, SIDEBAR_PROGRESS_MAPPING } from "./consts";
import BookingMonthStep from "./BookingMonthStep";
import BookingDateStep from "./BookingDateStep";
import BookingMasterStep from "./BookingMasterStep";
import BookingTimeStep from "./BookingTimeStep";
import { BookingMaster, BookingRecord } from "./models";
import BookingCheckoutStep from "./BookingCheckoutStep";

interface BookingSidebarContentProps {
  data: BookingSidebarDataModel;
}

const BookingSidebarContent: FC<BookingSidebarContentProps> = ({ data }) => {
  const [saloonBaseInfo, setSaloonBaseInfo] = useState<null | SaloonBaseDataModel>(null);
  const [saloonBaseInfoLoading, setSaloonBaseInfoLoading] = useState<boolean>(false);
  const [bookingStep, setBookingStep] = useState<number>(
    SIDEBAR_PROGRESS_MAPPING.monthForm.progress
  );
  const [monthForm, setMonthForm] = useState<null | Date>(null);
  const [dateForm, setDateForm] = useState<null | Date>(null);
  const [masterForm, setMasterForm] = useState<null | BookingMaster>(null);
  const [timeForm, setTimeForm] = useState<null | BookingRecord>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const profileData = useSelector(profileUserDataSelector);

  const dispatch = useDispatch();

  const applyMonthForm = (monthFormData: Date) => {
    setMonthForm(monthFormData);
    setBookingStep(SIDEBAR_PROGRESS_MAPPING.dateForm.step);
  };

  const applyDateForm = (dateFormData: Date) => {
    setDateForm(dateFormData);
    setBookingStep(SIDEBAR_PROGRESS_MAPPING.masterForm.step);
  };

  const applyMasterForm = (masterFormData: BookingMaster) => {
    setMasterForm(masterFormData);
    setBookingStep(SIDEBAR_PROGRESS_MAPPING.timeForm.step);
  };

  const applyTimeForm = (timeFormData: BookingRecord) => {
    setTimeForm(timeFormData);
    setBookingStep(SIDEBAR_PROGRESS_MAPPING.checkoutForm.step);
  };

  const applyCheckoutForm = async (checkoutFormData: string) => {
    try {
      setIsLoading(true);
      if (timeForm) {
        await axiosInstance.post(
          bookServiceInstanceUrl(),
          {
            serviceInstanceId: timeForm.id,
            clientUserTypeMapId: profileData.userTypeMapId,
            comment: checkoutFormData,
          },
        );
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.SUCCESS,
          summary: "Запись",
          detail: "Запись успешно осуществлена.",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
        dispatch(commonSetBookingModalData(null));
      }
    } catch (e) {
      const { response } = e as AxiosError;

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Запись",
        detail: response?.data || "Неизвестная ошибка",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const applyLoginCheckoutForm = async (email: string, password: string, checkoutFormData: string) => {
    if (timeForm) {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.post(loginBookServiceInstanceUrl(),
          {
            serviceInstanceId: timeForm.id,
            comment: checkoutFormData,
            email,
            password,
          },
        );

        const toastToBeShown = {
          severity: TOAST_SEVERITIES.SUCCESS,
          summary: "Запись",
          detail: "Запись успешно осуществлена.",
          life: TOAST_DEFAULT_LIFE,
        };

        setCookie(AUTH_COOKIE_NAME, data.token);
        dispatch(commonSetUiToast(toastToBeShown));
        dispatch(commonSetBookingModalData(null));
        dispatch(profileGetInfo() as any);
      } catch (e) {
        const { response } = e as AxiosError;

        const toastToBeShown = {
          severity: TOAST_SEVERITIES.ERROR,
          summary: "Запись",
          detail: response?.data || "Неизвестная ошибка",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackButtonClick = () => {
    switch (bookingStep) {
      case SIDEBAR_PROGRESS_MAPPING.dateForm.step:
        setBookingStep(SIDEBAR_PROGRESS_MAPPING.monthForm.step);
        setDateForm(null);
        setMonthForm(null);
        break;
      case SIDEBAR_PROGRESS_MAPPING.masterForm.step:
        setBookingStep(SIDEBAR_PROGRESS_MAPPING.dateForm.step);
        setMasterForm(null);
        setDateForm(null);
        break;
      case SIDEBAR_PROGRESS_MAPPING.timeForm.step:
        setBookingStep(SIDEBAR_PROGRESS_MAPPING.masterForm.step);
        setTimeForm(null);
        setMasterForm(null);
        break;
      case SIDEBAR_PROGRESS_MAPPING.checkoutForm.step:
        setBookingStep(SIDEBAR_PROGRESS_MAPPING.timeForm.step);
        setTimeForm(null);
        break;
    }
  };

  const fetchSaloonBaseInfo = async () => {
    try {
      setSaloonBaseInfoLoading(true);

      const response = await axiosInstance.get(saloonBaseInfoUrl(data.idSaloon));

      setSaloonBaseInfo(response.data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Записи",
        detail: "Ошибка загрузки информации о салоне",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      dispatch(commonSetBookingModalData(null));
    } finally {
      setSaloonBaseInfoLoading(false);
    }
  };

  useEffect(() => {
    fetchSaloonBaseInfo();
  }, [data.idSaloon]);

  return (
    <div className={classNames("flex", "flex-column", "h-full")}>
      <div
        className={classNames("flex", "align-items-center", "gap-2", "pt-1")}
        style={{ height: 52 }}
      >
        <Button
          disabled={bookingStep === SIDEBAR_PROGRESS_MAPPING.monthForm.step}
          onClick={handleBackButtonClick}
          icon="pi pi-arrow-left"
          severity="secondary"
          size="small"
          rounded
          text
        />
        <ProgressBar
          value={SIDEBAR_PROGRESS_LIST[bookingStep].progress}
          showValue={false}
          color="#ff1368"
          style={{ height: 8 }}
          className="w-full"
        />
      </div>

      <div className="flex-1">
        <h2 className="mt-4">{SIDEBAR_PROGRESS_LIST[bookingStep].title}</h2>
        <div className={classNames("py-4", "overflow-auto")}>
          {saloonBaseInfoLoading && <Skeleton width="100%" height="256px" />}
          {saloonBaseInfo ? <>
            {bookingStep === SIDEBAR_PROGRESS_MAPPING.monthForm.step && (
              <BookingMonthStep
                initialState={monthForm}
                handleApply={applyMonthForm}
              />
            )}
            {bookingStep === SIDEBAR_PROGRESS_MAPPING.dateForm.step &&
              monthForm && (
                <BookingDateStep
                  initialState={dateForm}
                  month={monthForm.getMonth() + 1}
                  year={monthForm.getFullYear()}
                  idSaloon={data.idSaloon}
                  idProcedure={data.idProcedure}
                  handleApply={applyDateForm}
                />
              )}
            {bookingStep === SIDEBAR_PROGRESS_MAPPING.masterForm.step &&
              dateForm && (
                <BookingMasterStep
                  initialState={masterForm}
                  date={dateForm}
                  idSaloon={data.idSaloon}
                  idProcedure={data.idProcedure}
                  handleApply={applyMasterForm}
                />
              )}
            {bookingStep === SIDEBAR_PROGRESS_MAPPING.timeForm.step &&
              dateForm &&
              masterForm && (
                <BookingTimeStep
                  initialState={timeForm}
                  date={dateForm}
                  idMaster={masterForm.id}
                  idSaloon={data.idSaloon}
                  idProcedure={data.idProcedure}
                  handleApply={applyTimeForm}
                />
              )}
            {bookingStep === SIDEBAR_PROGRESS_MAPPING.checkoutForm.step &&
              dateForm &&
              masterForm &&
              timeForm && (isLoading ? (
                <Skeleton width="100%" height="256px" />
              ) : (
                <BookingCheckoutStep
                  date={dateForm}
                  master={masterForm}
                  record={timeForm}
                  hasAdress={!!saloonBaseInfo.street}
                  handleApply={applyCheckoutForm}
                  handleApplyLogin={applyLoginCheckoutForm}
                />
              ))}
            <Message
              severity={MessageSeverity.INFO}
              className={classNames("w-full", "mt-2")}
              text={`Салон оказывает услуги с выездом${saloonBaseInfo.visitPayment ? `, стоимость посещения - ${saloonBaseInfo.visitPayment}` : ''}`}
            />
          </> : null}
        </div>
      </div>
    </div>
  );
};
export default BookingSidebarContent;
