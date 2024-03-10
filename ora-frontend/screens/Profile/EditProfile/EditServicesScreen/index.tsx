"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabPanel, TabView } from "primereact/tabview";
import classNames from "classnames";

import AddServiceForm from "@/screens/Profile/EditProfile/EditServicesScreen/AddServiceForm";
import EditServicesTable from "@/screens/Profile/EditProfile/EditServicesScreen/EditServicesTable";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { deleteSaloonServicesUrl, getSaloonServicesUrl } from "@/api/saloon";
import axiosInstance from "@/api";

import styles from "./style.module.scss";

export interface ServiceModel {
  id: number;
  name: string;
}

const EditServicesScreen = () => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        getSaloonServicesUrl(userTypeMapId),
        {}
      );
      setServices(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка загрузки  услуг",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(
    async (serviceId: number) => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.post(
          deleteSaloonServicesUrl(userTypeMapId),
          { codes: [serviceId] }
        );
        setServices(data);

        const toastToBeShown = {
          severity: TOAST_SEVERITIES.SUCCESS,
          summary: "Профиль",
          detail: "Услуга успешно удалена",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      } catch (e) {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.ERROR,
          summary: "Профиль",
          detail: "Ошибка удаления услуги",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      } finally {
        setLoading(false);
      }
    },
    [userTypeMapId]
  );

  return (
    <div className={classNames(styles.container, "py-4")}>
      <TabView className={classNames("w-full", "mt-4")}>
        <TabPanel header="Добавление услуг">
          <AddServiceForm setServices={setServices} />
        </TabPanel>
        <TabPanel header="Список услуг">
          <EditServicesTable
            services={services}
            loading={loading}
            deleteService={deleteService}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default memo(EditServicesScreen);
