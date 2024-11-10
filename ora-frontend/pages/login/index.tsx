import { ChangeEvent, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useRouter } from "next/navigation";
import Head from "next/head";

import axiosInstance from "@/api";
import { loginUrl } from "@/api/authorization";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import { setCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import Button from "@/components/Button";

import styles from "./page.module.scss";

interface LoginPageStateModel {
  login: string;
  password: string;
  userType: null | number;
}

interface LoginFormModel {
  email: string;
  password: string;
  userType?: number;
}

const LOGIN_INITIAL_STATE: LoginPageStateModel = {
  login: "",
  password: "",
  userType: null,
};

const Login = () => {
  const [state, setState] = useState<LoginPageStateModel>(LOGIN_INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableUserTypes, setAvailableUserTypes] = useState<null | Array<{
    id: number;
    name: string;
  }>>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const setLogin = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      login: (e.target as HTMLInputElement).value,
    }));
  };

  const setPassword = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      password: (e.target as HTMLInputElement).value,
    }));
  };

  const setAvailableUserType = (e: DropdownChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      userType: e.value,
    }));
  };

  const onApply = async () => {
    setLoading(true);

    try {
      const payload: LoginFormModel = {
        email: state.login,
        password: state.password,
      };

      if (state.userType) {
        payload.userType = state.userType;
      }

      const response = await axiosInstance.post(loginUrl, payload);

      const {
        data: { token, availableUserTypes },
      } = response;

      if (!token) {
        setAvailableUserTypes(availableUserTypes ? availableUserTypes : null);
        setAvailableUserType({ value: null } as DropdownChangeEvent);
      } else {
        setCookie(AUTH_COOKIE_NAME, token);
        router.push("/");
      }
    } catch (e) {
      const { response } = e as AxiosError;

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Авторизация",
        detail: response?.data || "Неизвестная ошибка",
        life: TOAST_DEFAULT_LIFE,
      };

      setAvailableUserTypes(null);
      setAvailableUserType({ value: null } as DropdownChangeEvent);
      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.login.length || !state.password.length) return true;

    return false;
  }, [state]);

  return (
    <>
      <Head>
        <title>ORA - Логин</title>
      </Head>
      <div className={classNames(styles.main, "px-2")}>
        <div className={styles.loginFormWrapper}>
          <h2 className={classNames(styles.title, "pb-2", "mb-4", "w-full")}>
            Авторизация
          </h2>
          <InputText
            className={classNames(styles.input, "mb-2", "w-full")}
            placeholder="Email"
            maxLength={32}
            value={state.login}
            onChange={setLogin}
          />
          <Password
            className={classNames(
              availableUserTypes ? "mb-2" : "mb-4",
              "w-full"
            )}
            inputClassName={classNames(styles.input, styles.password)}
            placeholder="Пароль"
            feedback={false}
            maxLength={32}
            value={state.password}
            onChange={setPassword}
            toggleMask
          />
          {availableUserTypes && (
            <Dropdown
              value={state.userType}
              onChange={setAvailableUserType}
              options={availableUserTypes || []}
              showClear
              placeholder="Тип пользователя"
              optionLabel="name"
              optionValue="id"
              className={classNames("mb-4", "w-full")}
            />
          )}
          <Button
            className={classNames(
              "mb-5",
              "w-full",
              "flex",
              "align-items-center",
              "justify-content-center"
            )}
            disabled={disabledButton}
            onClick={onApply}
          >
            Войти
          </Button>
          <Link
            href="/registration/client"
            className={classNames(styles.link, "mb-3")}
          >
            Регистрация
          </Link>
          <Link className={styles.link} href="/restore/request">
            Забыли пароль?
          </Link>
        </div>
      </div>
      <div
        className={classNames({
          [styles.loadingEnabled]: loading,
          [styles.loadingBlock]: !loading,
        })}
      >
        <ProgressSpinner />
      </div>
    </>
  );
};

export default Login;
