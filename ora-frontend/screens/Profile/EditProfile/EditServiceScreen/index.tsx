"use client";

import { FC, memo, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";

import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import { getSaloonServiceDetailsUrl } from "@/api/saloon";
import axiosInstance from "@/api";
import { isNumeric } from "@/utils";

import styles from "./style.module.scss";

interface EditServiceScreenProps {
  serviceId: string;
}

interface MasterInfoModel {
  id: number;
  name: string;
  email: string;
  mainImage: string | null;
}

interface ActiveMasterInfoModel extends MasterInfoModel {
  price: number;
}

interface ServiceInfoModel {
  id: number;
  description: string;
  procedureName: string;
  activeMasters: ActiveMasterInfoModel[];
  availableMasters: MasterInfoModel[];
}

const EditServiceScreen: FC<EditServiceScreenProps> = ({ serviceId }) => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfoModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

      setServiceInfo(data);
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
