"use client";
import { useState } from "react";
import classNames from "classnames";
import { Password } from "primereact/password";
import { Skeleton } from "primereact/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { object, string } from "yup";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

import axiosInstance from "@/api";
import Button from "@/components/Button";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { postUpdatePasswordUrl } from "@/api/passwordRestore";

import styles from "./page.module.scss";

interface UpdatePageStateModel {
  passwordFirst: string;
  passwordSecond: string;
}

const RESTORE_INITIAL_STATE: UpdatePageStateModel = {
  passwordFirst: "",
  passwordSecond: "",
};

const restoreSchema = object({
  passwordFirst: string().min(5).max(32).trim().required(),
  passwordSecond: string().min(5).max(32).trim().required(),
});

const Restore = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const formik = useFormik<UpdatePageStateModel>({
    initialValues: RESTORE_INITIAL_STATE,
    validateOnMount: true,
    isInitialValid: false,
    validate: (data) => {
      try {
        restoreSchema.validateSync(data);
      } catch (e) {
        return JSON.stringify(e);
      }

      if (data.passwordFirst !== data.passwordSecond) {
        return {
          passwordSecond: "Пароли должны совпадать.",
        } as UpdatePageStateModel;
      }

      return {};
    },
    onSubmit: async (data) => {
      setLoading(true);
      await axiosInstance
        .post(postUpdatePasswordUrl, {
          password: data.passwordFirst,
          token: searchParams.get("token"),
        })
        .then(() => {
          formik.resetForm();
          router.push("/login");
        })
        .catch(({ response }) => {
          const toastToBeShown = {
            severity: TOAST_SEVERITIES.ERROR,
            summary: "Обновление пароля",
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
    <form
      className={classNames(styles.main, "px-2")}
      onSubmit={formik.handleSubmit}
    >
      <div className={styles.updateFormWrapper}>
        {loading ? (
          <Skeleton width="100%" height="256px" />
        ) : (
          <>
            <h2 className={classNames(styles.title, "pb-2", "mb-4", "w-full")}>
              Обновление пароля
            </h2>
            <div className={classNames("mb-4", "w-full")}>
              <label className={styles.lightText} htmlFor="passwordFirst">
                Введите новый пароль
              </label>
              <Password
                id="passwordFirst"
                className="w-full"
                inputClassName={classNames(
                  styles.input,
                  styles.password,
                  "mt-2"
                )}
                placeholder="Пароль"
                promptLabel="Введите пароль"
                weakLabel="Лёгкий пароль"
                mediumLabel="Средний пароль"
                strongLabel="Тяжёлый пароль"
                value={formik.values.passwordFirst}
                onChange={(e) =>
                  formik.setFieldValue("passwordFirst", e.target.value)
                }
                maxLength={32}
                toggleMask
              />
            </div>

            <div className={classNames("mb-4", "w-full")}>
              <label className={styles.lightText} htmlFor="passwordSecond">
                Повторите новый пароль
              </label>
              <Password
                id="passwordSecond"
                className="w-full"
                inputClassName={classNames(
                  styles.input,
                  styles.password,
                  "mt-2"
                )}
                placeholder="Пароль"
                promptLabel="Введите пароль"
                weakLabel="Лёгкий пароль"
                mediumLabel="Средний пароль"
                strongLabel="Тяжёлый пароль"
                value={formik.values.passwordSecond}
                onChange={(e) =>
                  formik.setFieldValue("passwordSecond", e.target.value)
                }
                maxLength={32}
                toggleMask
              />
            </div>
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
              Обновить
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default Restore;
