import { FC, memo, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";

import EditServiceBaseDataForm from "@/screens/Profile/EditProfile/EditServiceScreen/EditServiceBaseDataForm";
import EditServiceEditMastersTable from "@/screens/Profile/EditProfile/EditServiceScreen/EditServiceEditMastersTable";
import EditServiceAddMasterForm from "@/screens/Profile/EditProfile/EditServiceScreen/EditServiceAddMasterForm";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import {
  getSaloonServiceAddMastersUrl,
  getSaloonServiceDetailsUrl,
  getSaloonServiceRemoveMastersUrl,
  getSaloonServiceUpdateBaseDataUrl,
  getSaloonServiceUpdateMasterUrl,
} from "@/api/saloon";
import axiosInstance from "@/api";
import { isNumeric } from "@/utils";
import {
  AddingMasterFormPayload,
  ServiceBaseDataForm,
  ServiceInfoModel,
  SubmitEditMasterData,
} from "@/screens/Profile/EditProfile/EditServiceScreen/types";
import { prepareServiceInfo } from "@/screens/Profile/EditProfile/EditServiceScreen/helper";

import styles from "./style.module.scss";

interface EditServiceScreenProps {
  serviceId: string;
}

const EditServiceScreen: FC<EditServiceScreenProps> = ({ serviceId }) => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfoModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isNumeric(serviceId)) {
      loadServiceInfo();
    }
  }, []);

  const loadServiceInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        getSaloonServiceDetailsUrl(userTypeMapId, +serviceId),
        {}
      );

      setServiceInfo(prepareServiceInfo(data));
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка загрузки услуги",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  }, []);

  const submitBaseDataForm = async (payload: ServiceBaseDataForm) => {
    try {
      setDisabled(true);
      const { data } = await axiosInstance.post(
        getSaloonServiceUpdateBaseDataUrl(userTypeMapId, +serviceId),
        payload
      );

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Основная информация об услуге успешно обновлена",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setServiceInfo(prepareServiceInfo(data));
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка обновления информации об услуге",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setDisabled(false);
    }
  };

  const submitAddMasterForm = async (payload: AddingMasterFormPayload) => {
    try {
      setDisabled(true);
      const { data } = await axiosInstance.post(
        getSaloonServiceAddMastersUrl(userTypeMapId, +serviceId),
        { masters: [payload] }
      );

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Мастер успешно добавлен для оказания услуги",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setServiceInfo(prepareServiceInfo(data));
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка добавления мастера для оказания услуги",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setDisabled(false);
    }
  };

  const submitRemoveMasterForm = async (id: number) => {
    try {
      setDisabled(true);
      const { data } = await axiosInstance.post(
        getSaloonServiceRemoveMastersUrl(userTypeMapId, +serviceId),
        { codes: [id] }
      );

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Мастер больше не оказывает данную услугу",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setServiceInfo(prepareServiceInfo(data));
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка удаления мастера с оказываемой им услуги",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setDisabled(false);
    }
  };

  const submitEditMasterForm = async (master: SubmitEditMasterData) => {
    try {
      setDisabled(true);
      const { data } = await axiosInstance.post(
        getSaloonServiceUpdateMasterUrl(userTypeMapId, +serviceId),
        { master }
      );

      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Информация мастера об оказываемой услуге успешно обновлена",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setServiceInfo(prepareServiceInfo(data));
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка редактирования данных мастера и оказываемой им услуги",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setDisabled(false);
    }
  };

  if (loading) {
    return <Skeleton width="100%" height="512px" className="my-4" />;
  }

  if (!serviceInfo) {
    return <h3 className="my-4">Нет информации об услуге</h3>;
  }

  return (
    <div className={classNames(styles.container, "py-4", "grid")}>
      <h3>{serviceInfo.procedureName}</h3>
      <TabView className={classNames("w-full", "mt-4")}>
        <TabPanel
          header="Редактирование базовой информации"
          disabled={disabled}
        >
          <EditServiceBaseDataForm
            serviceInfo={serviceInfo}
            onSubmit={submitBaseDataForm}
          />
        </TabPanel>
        <TabPanel header="Добавление мастера" disabled={disabled}>
          <EditServiceAddMasterForm
            serviceInfo={serviceInfo}
            onSubmit={submitAddMasterForm}
          />
        </TabPanel>
        <TabPanel header="Редактирование мастеров" disabled={disabled}>
          <EditServiceEditMastersTable
            serviceInfo={serviceInfo}
            onUpdate={submitEditMasterForm}
            onDelete={submitRemoveMasterForm}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default memo(EditServiceScreen);
