"use client";

import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { AxiosError } from "axios";
import { MessageSeverity } from "primereact/api";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Message } from "primereact/message";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

import axiosInstance from "@/api";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import { addSaloonMastersUrl } from "@/api/saloon";

import styles from "./style.module.scss";

const EditTeamAddMasterForm = () => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [code, setCode] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const changeCode = (e: InputNumberChangeEvent) => {
    setCode(e.value);
  };

  const addButtonDisabled = useMemo(() => code === null, [code]);

  const handleAddMaster = useCallback(async () => {
    try {
      setLoading(true);
      await axiosInstance.post(addSaloonMastersUrl(userTypeMapId), {
        code,
      });

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Мастер успешно добавлен",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setCode(null);
    } catch (e) {
      const { response } = e as AxiosError;

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: response?.data || "Ошибка добавления мастера",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  }, [code]);

  const handleCopy = useCallback(
    () =>
      navigator.clipboard.writeText(
        `${window.location.host}/registration/master?saloonReference=${userTypeMapId}`
      ),
    [code]
  );

  return (
    <div className={classNames(styles.container, "py-4")}>
      <Panel header="Добавить существующего мастера">
        <div>
          <InputNumber
            size={16}
            maxLength={8}
            value={code}
            onChange={changeCode}
            className="mr-2"
            placeholder="Код мастера"
            min={1}
          />
          <Button
            onClick={handleAddMaster}
            disabled={addButtonDisabled}
            loading={loading}
          >
            Добавить
          </Button>
        </div>
        <Message
          className={classNames(
            "mt-3",
            "w-full",
            "flex",
            "justify-content-start"
          )}
          severity={MessageSeverity.INFO}
          text="Код находится в личном кабинете мастера."
        />
      </Panel>
      <Panel
        className="mt-4"
        header="Ссылка для самостоятельной регистрации мастера"
      >
        <Button
          tooltip="Ссылка скопирована."
          tooltipOptions={{
            showDelay: 100,
            hideDelay: 500,
            showEvent: "click",
          }}
          onClick={handleCopy}
          outlined
        >
          Нажмите, чтобы скопировать
        </Button>
        <br />
        <Message
          className={classNames(
            "mt-3",
            "w-full",
            "flex",
            "justify-content-start"
          )}
          severity={MessageSeverity.INFO}
          text="Мастер будет автоматически добавлен в салон после того, как пройдёт регистрацию нового пользователя."
        />
      </Panel>
    </div>
  );
};

export default EditTeamAddMasterForm;
