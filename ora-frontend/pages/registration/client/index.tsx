import classNames from "classnames";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { addLocale, MessageSeverity } from "primereact/api";
import { Password } from "primereact/password";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { useRouter } from "next/navigation";
import moment from "moment";
import { boolean, date, object, string } from "yup";
import { useFormik } from "formik";

import RU_LOCALE from "@/consts/locale";
import axiosInstance from "@/api";
import { postUserRegistrationUrl } from "@/api/registration";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import Button from "@/components/Button";

import styles from "./page.module.scss";

interface RegistrationClientStateModel {
  email: string;
  phone: string;
  name: string;
  lastName: string;
  password: string;
  birthday: Date | null;
  sex: string;
  agree: boolean;
}

const REGISTRATION_INITIAL_STATE: RegistrationClientStateModel = {
  email: "",
  phone: "",
  name: "",
  lastName: "",
  password: "",
  birthday: null,
  sex: "1",
  agree: true,
};

const clientSchema = object({
  email: string().email().trim().required(),
  phone: string().trim().min(17).max(17).required(),
  name: string().trim().min(2).max(32).required(),
  lastName: string().trim().min(2).max(32).required(),
  password: string().trim().min(5).max(32).required(),
  birthday: date().required(),
  sex: string().trim().min(1).max(1).required(),
  agree: boolean().required(),
});

const Registration: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  addLocale("ru", RU_LOCALE);
  const formik = useFormik({
    initialValues: REGISTRATION_INITIAL_STATE,
    validateOnMount: true,
    validate: (data) => {
      if (data.phone.replace(/[^0-9]/g, "").length < 12) {
        return {
          phone: "",
        } as RegistrationClientStateModel;
      }

      if (!["25", "29", "33", "44"].includes(data.phone.slice(5, 7))
      ) {
        return {
          phone: "Неверный код оператора связи.",
        } as RegistrationClientStateModel;
      }

      try {
        clientSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      return {};
    },
    onSubmit: async (data) => {
      const preparedState = {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
        birthday: moment(data.birthday).format("DD-MM-YYYY"),
        sex: +data.sex,
      };

      await axiosInstance
        .post(postUserRegistrationUrl, preparedState)
        .then(() => {
          router.push("/login");
        })
        .catch(({ response }) => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.ERROR,
            summary: "Регистрация",
            detail: response.data,
            life: TOAST_DEFAULT_LIFE,
          };

          dispatch(commonSetUiToast(toastToBeShown));
        });
    },
  });

  return (
    <form
      className={classNames("pt-5", "px-2", "flex", "justify-content-center")}
      onSubmit={formik.handleSubmit}
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
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
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
              value={formik.values.lastName}
              onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
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
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
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
              value={formik.values.password}
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
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
              name="phone"
              className={classNames(styles.input, "w-full", "mt-2", { "p-invalid": formik.errors.phone })}
              placeholder="Номер телефона"
              mask="+375-99-999-99-99"
              value={formik.values.phone}
              onChange={(e) => formik.setFieldValue("phone", e.target.value)}
            />
            {formik.errors.phone ? <Message className={classNames("mt-2", "w-full", "justify-content-start")} severity={MessageSeverity.ERROR} text={formik.errors.phone} /> : null}
          </div>
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="birthday">
              Дата рождения
            </label>
            <Calendar
              id="birthday"
              inputClassName={styles.input}
              className={classNames("w-full", "mt-2")}
              placeholder="Дата рождения"
              locale="ru"
              value={formik.values.birthday}
              onChange={(e) => formik.setFieldValue("birthday", e.target.value)}
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
                checked={formik.values.sex === "1"}
                onChange={() => formik.setFieldValue("sex", "1")}
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
                checked={formik.values.sex === "2"}
                onChange={() => formik.setFieldValue("sex", "2")}
              />
              <label htmlFor="sex1" className="ml-2">
                Мужской
              </label>
            </div>
          </div>
          <div
            className={classNames("flex", "pb-2", "mb-4", "w-full", "col-12")}
          >
            <Checkbox inputId="privacyPolicy" checked={formik.values.agree} disabled />
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
              "flex",
              "align-items-center",
              "justify-content-center",
              "col-12"
            )}
            disabled={!formik.isValid}
            type="submit"
          >
            Присоединиться к ORA
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Registration;
