import { FC, useState } from "react";
import classNames from "classnames";
import { ProgressBar } from "primereact/progressbar";
import { useDispatch } from "react-redux";

import { BookingSidebarDataModel } from "@/store/common/model";
import Button from "@/components/Button";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import {
  commonSetBookingModalData,
  commonSetUiToast,
} from "@/store/common/actions";

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
  const [bookingStep, setBookingStep] = useState<number>(
    SIDEBAR_PROGRESS_MAPPING.monthForm.progress
  );
  const [monthForm, setMonthForm] = useState<null | Date>(null);
  const [dateForm, setDateForm] = useState<null | Date>(null);
  const [masterForm, setMasterForm] = useState<null | BookingMaster>(null);
  const [timeForm, setTimeForm] = useState<null | BookingRecord>(null);

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

  const applyCheckoutForm = (checkoutFormData: string) => {
    const toastToBeShown = {
      severity: TOAST_SEVERITIES.SUCCESS,
      summary: "Запись",
      detail: "Запись успешно осуществлена.",
      life: TOAST_DEFAULT_LIFE,
    };

    dispatch(commonSetUiToast(toastToBeShown));
    dispatch(commonSetBookingModalData(null));
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
            timeForm && (
              <BookingCheckoutStep
                date={dateForm}
                master={masterForm}
                record={timeForm}
                handleApply={applyCheckoutForm}
              />
            )}
        </div>
      </div>
    </div>
  );
};
export default BookingSidebarContent;
