"use client";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";

import { addLocale } from "primereact/api";
import { Password } from "primereact/password";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";

import RU_LOCALE from "@/consts/locale";

import styles from "./page.module.scss";

const Registration = () => {
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
              maxLength={32}
            />
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="surname">
              Фамилия
            </label>
            <InputText
              id="surname"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Фамилия"
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
              <RadioButton inputId="sex1" name="sex" value="2" />
              <label htmlFor="sex1" className="ml-2">
                Мужской
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton inputId="sex2" name="sex" value="1" />
              <label htmlFor="sex2" className="ml-2">
                Женский
              </label>
            </div>
          </div>
          <div
            className={classNames("flex", "pb-2", "mb-4", "w-full", "col-12")}
          >
            <RadioButton inputId="privacyPolicy" />
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
          >
            Присоединиться к ORA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
