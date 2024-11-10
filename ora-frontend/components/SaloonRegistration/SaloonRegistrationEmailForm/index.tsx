import { ChangeEvent, FC, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { MessageSeverity } from "primereact/api";

import axiosInstance from "@/api";
import { postCheckCredentialsAvailabilityUrl } from "@/api/registration";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { RegistrationSaloonEmailFormModel } from "@/models/SaloonRegistration";
import { CredentialsAvailabilityModel } from "@/models/registration";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetEmailForm } from "@/store/registrationSaloon/actions";
import { commonSetUiToast } from "@/store/common/actions";
import { WRONG_EMAIL_FORMAT } from "@/consts/messages";
import { isEmailValid } from "@/utils/forms";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface SaloonRegistrationEmailFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationEmailForm: FC<SaloonRegistrationEmailFormModel> = ({
  onCountinueClick,
}) => {
  const { emailForm } = useSelector(registrationSaloonSelectedValuesSelector);
  const [state, setState] =
    useState<RegistrationSaloonEmailFormModel>(emailForm);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onApply = async () => {
    try {
      setIsLoading(true);
      const { data }: { data: CredentialsAvailabilityModel } = await axiosInstance.post(postCheckCredentialsAvailabilityUrl, { email: state.email });

      if (data.available) {
        dispatch(registrationSaloonSetEmailForm(state));
        onCountinueClick();
      } else {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.WARN,
          summary: "Регистрация",
          detail: "Аккаунт с указанной электронной почтой существует.",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      }
    } catch {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Регистрация",
        detail: "Ошибка проверки доступности электронной почты.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  const setEmail = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      email: (e.target as HTMLInputElement).value,
    }));
  };

  const isValid = isEmailValid(state.email);
  const disabledButton = !state.email.length || !isValid

  return (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-4",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>
        Введите Ваш адрес
        <br />
        электронной почты
      </h2>
      <InputText
        className={classNames(styles.input, "w-full", "mt-2")}
        placeholder="Электронная почта"
        type="email"
        value={state.email}
        onChange={setEmail}
        maxLength={32}
      />
      {state.email.length && !isValid ? <Message className={classNames("mt-2", "w-full", "justify-content-start")} severity={MessageSeverity.ERROR} text={WRONG_EMAIL_FORMAT} /> : null}
      <Button
        className={classNames(
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mb-3",
          "w-full"
        )}
        disabled={disabledButton}
        loading={isLoading}
        onClick={onApply}
      >
        Продолжить
      </Button>
      <p className={classNames(styles.lightText, styles.policy)}>
        Соображения высшего порядка, а также начало повседневной работы по
        формированию позиции требует определения и уточнения дальнейших
        направлений развития проекта.
      </p>
    </div>
  );
};

export default SaloonRegistrationEmailForm;
