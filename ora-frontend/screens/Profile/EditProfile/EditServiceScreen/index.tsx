"use client";

import { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";

import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import { isNumeric } from "@/utils";
import axiosInstance from "@/api";

import styles from "./style.module.scss";

interface EditServiceScreenProps {
  serviceId: string;
}

interface ServiceMasterInfo {
  id: number;
  name: string;
  price: number;
}

interface ServiceInfoModel {
  name: string;
  mastersInfo: ServiceMasterInfo[];
}

const EditServiceScreen: FC<EditServiceScreenProps> = ({ serviceId }) => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfoModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadServiceInfo();
  }, []);

  const loadServiceInfo = useCallback(async () => {
    try {
      setLoading(true);
      // const { data } = await axiosInstance.post(
      //   "",
      //   {}
      // );
      // setServiceInfo(data);
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

  if (loading) {
    return <Skeleton width="100%" height="512px" className="my-4" />;
  }

  if (!serviceInfo) {
    return <h3 className="my-4">Нет информации об услуге</h3>;
  }

  return (
    <div className={classNames(styles.container, "py-4")}>
      {JSON.stringify(serviceInfo)}
    </div>
  );
};

export default memo(EditServiceScreen);
