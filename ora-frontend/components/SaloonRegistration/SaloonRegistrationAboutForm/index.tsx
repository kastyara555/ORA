"use client";
import { ChangeEvent, FC, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import BY from "country-flag-icons/react/3x2/BY";
import { InputText } from "primereact/inputtext";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { InputTextarea } from "primereact/inputtextarea";

import axiosInstance from "@/api";
import { postCheckCredentialsAvailabilityUrl } from "@/api/registration";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { RegistrationSaloonAboutFormModel } from "@/models/SaloonRegistration";
import { CredentialsAvailabilityModel } from "@/models/registration";
import { registrationSaloonSetAboutForm } from "@/store/registrationSaloon/actions";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface SaloonRegistrationAboutFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAboutForm: FC<SaloonRegistrationAboutFormModel> = ({
  onCountinueClick,
}) => {
  const { aboutForm } = useSelector(registrationSaloonSelectedValuesSelector);
  const [state, setState] =
    useState<RegistrationSaloonAboutFormModel>(aboutForm);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onApply = async () => {
    try {
      setIsLoading(true);
      const { data }: { data: CredentialsAvailabilityModel } = await axiosInstance.post(postCheckCredentialsAvailabilityUrl, { phone: state.phone.replace(/\D/g, "") });

      if (data.available) {
        dispatch(registrationSaloonSetAboutForm(state));
        onCountinueClick();
      } else {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.WARN,
          summary: "Регистрация",
          detail: "Аккаунт с указанным номером телефона существует.",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      }
    } catch {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Регистрация",
        detail: "Ошибка проверки доступности номера телефона.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const setSaloonName = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      saloonName: (e.target as HTMLInputElement).value,
    }));
  };

  const setDescription = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      description: (e.target as HTMLInputElement).value,
    }));
  };

  const setName = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      name: (e.target as HTMLInputElement).value,
    }));
  };

  const setPhone = (e: InputMaskChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      phone: (e.target as HTMLInputElement).value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (
      state.name.trim().length < 2 ||
      !state.saloonName.trim().length ||
      state.phone.replace(/[^0-9]/g, "").length < 12 ||
      !["25", "29", "33", "44"].includes(state.phone.slice(5, 7))
    )
      return true;

    return false;
  }, [state]);

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-3",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>О Вас</h2>
      <p className={classNames(styles.lightText, styles.policy)}>
        Расскажите больше о своем салоне/компании
      </p>
      <InputText
        className={classNames(styles.input, "w-full")}
        placeholder="Название компании/салона"
        value={state.saloonName}
        onChange={setSaloonName}
        maxLength={32}
      />
      <InputTextarea
        className={classNames(styles.input, "w-full")}
        placeholder="Описание (опционально)"
        value={state.description}
        onChange={setDescription}
        maxLength={256}
        rows={3}
      />
      <InputText
        className={classNames(styles.input, "w-full")}
        placeholder="Ваше имя"
        value={state.name}
        onChange={setName}
        maxLength={32}
      />
      <div className={classNames("p-inputgroup")}>
        <span className="p-inputgroup-addon">
          <BY style={{ width: 24 }} />
        </span>
        <InputMask
          className={classNames(styles.input, "w-full")}
          placeholder="Ваш номер телефона"
          value={state.phone}
          onChange={setPhone}
          mask="+375-99-999-99-99"
        />
      </div>
      <Button
        className={classNames(
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mt-4",
          "mb-3",
          "w-full"
        )}
        onClick={onApply}
        disabled={disabledButton}
        loading={isLoading}
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationAboutForm;
