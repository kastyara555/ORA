import classNames from "classnames";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { InputTextarea } from "primereact/inputtextarea";
import { useRouter, useSearchParams } from "next/navigation";
import { object, string } from "yup";

import axiosInstance from "@/api";
import { postMasterRegistrationUrl } from "@/api/registration";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { isNumeric } from "@/utils";
import Button from "@/components/Button";

import styles from "./page.module.scss";

interface MasterRegistrationStateModel {
  email: string;
  phone: string;
  name: string;
  password: string;
  description: string;
}

const REGISTRATION_INITIAL_STATE: MasterRegistrationStateModel = {
  email: "",
  phone: "",
  name: "",
  password: "",
  description: "",
};

const masterSchema = object({
  email: string().email().trim().required(),
  phone: string().trim().min(17).max(17).required(),
  name: string().trim().min(2).max(32).required(),
  password: string().trim().min(5).max(32).required(),
  description: string().trim().max(256).notRequired(),
});

const Registration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formik = useFormik({
    initialValues: REGISTRATION_INITIAL_STATE,
    validateOnMount: true,
    validate: (data) => {
      try {
        masterSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      if (
        data.phone.replace(/[^0-9]/g, "").length < 12 ||
        !["25", "29", "33", "44"].includes(data.phone.slice(5, 7))
      ) {
        return {
          phone: "Ошибка валидации телефона.",
        } as MasterRegistrationStateModel;
      }

      return {};
    },
    onSubmit: async (data) => {
      const saloonReference = searchParams.get("saloonReference");

      if (saloonReference && !isNumeric(saloonReference)) {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.ERROR,
          summary: "Регистрация",
          detail: "Салон, на который ссылается форма не существует.",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
        return;
      }

      const preparedState: any = {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
      };

      if (saloonReference && isNumeric(saloonReference)) {
        preparedState.relatedSaloonMapId = +saloonReference;
      }

      await axiosInstance
        .post(postMasterRegistrationUrl, preparedState)
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

          <div className={classNames("col-12", "lg:col-6", "xl:col-6", "pb-1")}>
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

          <div className={classNames("col-12", "lg:col-6", "xl:col-6", "pb-1")}>
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

          <div className={classNames("col-12", "lg:col-6", "xl:col-6", "pb-1")}>
            <label className={styles.lightText} htmlFor="phone">
              Номер телефона
            </label>
            <InputMask
              id="phone"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Номер телефона"
              mask="+375-99-999-99-99"
              value={formik.values.phone}
              onChange={(e) => formik.setFieldValue("phone", e.target.value)}
            />
          </div>

          <div className={classNames("col-12", "mb-2")}>
            <label className={styles.lightText} htmlFor="description">
              Описание
            </label>
            <InputTextarea
              id="description"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Описание (опционально)"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              maxLength={256}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className={classNames(
              "flex",
              "align-items-center",
              "justify-content-center",
              "w-full",
              "mx-2"
            )}
            disabled={!formik.isValid}
          >
            Присоединиться к ORA
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Registration;
