"use client";
import { ChangeEvent, FC, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";

import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { RegistrationSaloonVisitPaymentFormModel } from "@/models/SaloonRegistration";
import { registrationSaloonSetVisitPaymentForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationVisitPaymentFormModel {
  onCountinueClick(): void;
}

interface SaloonRegistrationVisitPaymentFormStateModel {
  free: boolean;
  price: string;
}

const prepareInitialState = (
  visitPaymentForm: RegistrationSaloonVisitPaymentFormModel
): SaloonRegistrationVisitPaymentFormStateModel => ({
  free: visitPaymentForm.payment === 0,
  price: visitPaymentForm.payment.toString(),
});

const SaloonRegistrationVisitPaymentForm: FC<
  SaloonRegistrationVisitPaymentFormModel
> = ({ onCountinueClick }) => {
  const { visitPaymentForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );

  const [state, setState] =
    useState<SaloonRegistrationVisitPaymentFormStateModel>(
      prepareInitialState(visitPaymentForm)
    );

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(
      registrationSaloonSetVisitPaymentForm({
        payment: state.free ? 0 : +state.price,
      })
    );
    onCountinueClick();
  };

  const setFree = (e: RadioButtonChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      free: e.value,
    }));
  };

  const setPrice = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      price: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.free && (!state.price.length || state.price === "0"))
      return true;

    return false;
  }, [state]);

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-2",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={classNames(styles.title, styles.lightText)}>
        Какую плату Вы берёте за выезд на место оказания услуги?
      </h2>

      <div
        className={classNames(
          "flex",
          "pb-2",
          "w-full",
          "col-12",
          "align-items-baseline"
        )}
      >
        <RadioButton
          inputId="free"
          checked={state.free}
          value={true}
          onChange={setFree}
        />
        <label htmlFor="free" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>Бесплатно</h3>
        </label>
      </div>
      <div
        className={classNames(
          "flex",
          "pb-2",
          "w-full",
          "col-12",
          "align-items-baseline"
        )}
      >
        <RadioButton
          inputId="pay"
          checked={!state.free}
          value={false}
          onChange={setFree}
        />
        <label htmlFor="pay" className={classNames(styles.lightText, "ml-2")}>
          <h3 className={classNames(styles.lightText, "mb-1")}>
            Платно, стоимость&nbsp;—&nbsp;
            <InputText
              disabled={state.free}
              type="number"
              value={state.price}
              onChange={setPrice}
              min={1}
              max={100}
            />
          </h3>
        </label>
      </div>
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mb-3"
        )}
        disabled={disabledButton}
        onClick={onApply}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationVisitPaymentForm;
