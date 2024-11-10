import { useState } from "react";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { object, string } from "yup";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import Head from "next/head";

import axiosInstance from "@/api";
import Button from "@/components/Button";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { postSendPasswordRestorationUrl } from "@/api/passwordRestore";

import styles from "./page.module.scss";

interface RestorePageStateModel {
  email: string;
}

const RESTORE_INITIAL_STATE: RestorePageStateModel = {
  email: "",
};

const restoreSchema = object({
  email: string().email().trim().required(),
});

const Restore = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const formik = useFormik<RestorePageStateModel>({
    initialValues: RESTORE_INITIAL_STATE,
    validateOnMount: true,
    isInitialValid: false,
    validate: (data) => {
      try {
        restoreSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      return {};
    },
    onSubmit: async (data) => {
      setLoading(true);
      await axiosInstance
        .post(postSendPasswordRestorationUrl, { email: data.email })
        .then(() => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.SUCCESS,
            summary: "Восстановление доступа",
            detail:
              "Письмо со ссылкой направлено на указанную электронную почту.",
            life: TOAST_DEFAULT_LIFE,
          };
          dispatch(commonSetUiToast(toastToBeShown));

          formik.resetForm();
        })
        .catch(({ response }) => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.ERROR,
            summary: "Восстановление доступа",
            detail: response.data,
            life: TOAST_DEFAULT_LIFE,
          };
          dispatch(commonSetUiToast(toastToBeShown));
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Head>
        <title>ORA - Восстановление пароля</title>
      </Head>
      <form
        className={classNames(styles.main, "px-2")}
        onSubmit={formik.handleSubmit}
      >
        <div className={styles.restoreFormWrapper}>
          {loading ? (
            <Skeleton width="100%" height="256px" />
          ) : (
            <>
              <h2 className={classNames(styles.title, "pb-2", "mb-4", "w-full")}>
                Восстановление пароля
              </h2>
              <InputText
                type="email"
                className={classNames(styles.input, "mb-4", "w-full")}
                placeholder="Введите email"
                maxLength={32}
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
              />
              <Button
                className={classNames(
                  "mb-5",
                  "w-full",
                  "flex",
                  "align-items-center",
                  "justify-content-center"
                )}
                disabled={!formik.isValid}
              >
                Отправить ссылку
              </Button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default Restore;
