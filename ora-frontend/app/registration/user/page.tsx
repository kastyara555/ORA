"use client";
import classNames from "classnames";
import { ChangeEvent, useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { Button } from "primereact/button";
import { addLocale } from "primereact/api";
import { Password } from "primereact/password";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";

import RU_LOCALE from "@/consts/locale";
import { isEmailValid } from "@/utils/forms";

import styles from "./page.module.scss";

interface RegistrationPageStateModel {
  email: string;
  phone: string;
  name: string;
  lastName: string;
  password: string;
  birthday: Date | null;
  sex: string;
  agree: boolean;
}

const REGISTRATION_INITIAL_STATE: RegistrationPageStateModel = {
  email: "",
  phone: "",
  name: "",
  lastName: "",
  password: "",
  birthday: null,
  sex: "1",
  agree: true,
};

const Registration = () => {
  const [state, setState] = useState<RegistrationPageStateModel>(
    REGISTRATION_INITIAL_STATE
  );

  const setEmail = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      email: (e.target as HTMLInputElement).value,
    }));
  };

  const setName = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      name: (e.target as HTMLInputElement).value,
    }));
  };

  const setLastName = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      lastName: (e.target as HTMLInputElement).value,
    }));
  };

  const setPassword = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      password: (e.target as HTMLInputElement).value,
    }));
  };

  const setPhone = (e: InputMaskChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      phone: (e.target as HTMLInputElement).value,
    }));
  };

  const setBirthday = (e: CalendarChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      birthday: (e as any).value,
    }));
  };

  const setSex = (e: RadioButtonChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      sex: e.value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (
      !state.email.length ||
      !isEmailValid(state.email) ||
      state.password.length < 5 ||
      state.name.length < 2 ||
      state.lastName.length < 2 ||
      !state.birthday ||
      state.phone.replace(/[^0-9]/g, "").length < 12 ||
      !["25", "29", "33", "44"].includes(state.phone.slice(5, 7))
    )
      return true;

    return false;
  }, [state]);

  addLocale("ru", RU_LOCALE);

  return (
    <div
      className={classNames("pt-5", "px-2", "flex", "justify-content-center")}
    >
      <div className={styles.registrationFormWrapper}>
        <h2 className={classNames(styles.lightText, "pl-2", "mb-4", "w-full")}>
          Добро пожаловать в ORA!
        </h2>
        <div className={classNames("grid", "w-full", "pb-1")}>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="name">
              Имя
            </label>
            <InputText
              id="name"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Имя"
              value={state.name}
              onChange={setName}
              maxLength={32}
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="lastName">
              Фамилия
            </label>
            <InputText
              id="lastName"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Фамилия"
              value={state.lastName}
              onChange={setLastName}
              maxLength={32}
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="email">
              Email
            </label>
            <InputText
              id="email"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Email"
              type="email"
              value={state.email}
              onChange={setEmail}
              maxLength={32}
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="password">
              Пароль
            </label>
            <Password
              id="password"
              className={classNames("p-0", "w-full", "mt-2")}
              inputClassName={classNames(styles.input, styles.password)}
              placeholder="Пароль"
              promptLabel="Введите пароль"
              weakLabel="Лёгкий пароль"
              mediumLabel="Средний пароль"
              strongLabel="Тяжёлый пароль"
              value={state.password}
              onChange={setPassword}
              maxLength={32}
              toggleMask
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="phone">
              Номер телефона
            </label>
            <InputMask
              id="phone"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Номер телефона"
              mask="+375-99-999-99-99"
              value={state.phone}
              onChange={setPhone}
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="birthday">
              Дата рождения
            </label>
            <Calendar
              id="birthday"
              inputClassName={styles.input}
              className={classNames("w-full", "mt-2")}
              placeholder="Дата записи"
              locale="ru"
              value={state.birthday}
              onChange={setBirthday}
              showButtonBar
            />
          </div>
          <h3 className={classNames(styles.lightText, "col-12")}>Пол</h3>
          <div
            className={classNames(
              "flex",
              "gap-3",
              "pb-2",
              "mb-5",
              "w-full",
              "col-12"
            )}
          >
            <div className="flex align-items-center">
              <RadioButton
                inputId="sex2"
                name="sex"
                value="1"
                checked={state.sex === "1"}
                onChange={setSex}
              />
              <label htmlFor="sex2" className="ml-2">
                Женский
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="sex1"
                name="sex"
                value="2"
                checked={state.sex === "2"}
                onChange={setSex}
              />
              <label htmlFor="sex1" className="ml-2">
                Мужской
              </label>
            </div>
          </div>
          <div
            className={classNames("flex", "pb-2", "mb-4", "w-full", "col-12")}
          >
            <Checkbox inputId="privacyPolicy" checked={state.agree} disabled />
            <label htmlFor="privacyPolicy" className="ml-2">
              Соображения высшего порядка, а также начало повседневной работы по
              формированию позиции требует определения и уточнения дальнейших
              направлений развития проекта. Задача организации, в особенности же
              реализация намеченного плана развития создаёт предпосылки
              качественно новых шагов для новых предложений. Разнообразный и
              богатый опыт повышение уровня гражданского сознания способствует
              повышению актуальности модели развития.
            </label>
          </div>
          <Button
            className={classNames(
              styles.button,
              "flex",
              "align-items-center",
              "justify-content-center",
              "col-12"
            )}
            disabled={disabledButton}
          >
            Присоединиться к ORA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
