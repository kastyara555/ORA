"use client";

import { FC, memo, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import classNames from "classnames";

import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetUiToast } from "@/store/common/actions";
import { getSaloonServiceDetailsUrl } from "@/api/saloon";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import axiosInstance, { BASE_URL } from "@/api";
import { isNumeric } from "@/utils";

import styles from "./style.module.scss";

interface EditServiceScreenProps {
  serviceId: string;
}

interface MasterInfoModel {
  id: number;
  name: string;
  email: string;
  mainImage: string;
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

      const preparedData: ServiceInfoModel = {
        ...data,
        availableMasters: data.availableMasters.map(
          (master: MasterInfoModel) => ({
            ...master,
            mainImage: master.mainImage
              ? BASE_URL.concat(master.mainImage)
              : DEFAULT_PROFILE_IMAGE,
          })
        ),
        activeMasters: data.activeMasters.map(
          (master: ActiveMasterInfoModel) => ({
            ...master,
            mainImage: master.mainImage
              ? BASE_URL.concat(master.mainImage)
              : DEFAULT_PROFILE_IMAGE,
          })
        ),
      };

      setServiceInfo(preparedData);
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

  const selectedCountryTemplate = (
    option: MasterInfoModel,
    props: DropdownProps
  ) =>
    option ? (
      <div className="flex align-items-center">
        <img
          src={option.mainImage}
          alt={option.mainImage}
          className={classNames(
            styles.masterAvatar,
            "h-4rem",
            "shadow-2",
            "mr-2"
          )}
        />
        <div>
          ({option.id})&nbsp;{option.name}&nbsp;{option.email}
        </div>
      </div>
    ) : (
      <span>{props.placeholder}</span>
    );

  const countryOptionTemplate = (option: MasterInfoModel) => (
    <div className="flex align-items-center">
      <img
        src={option.mainImage}
        alt={option.mainImage}
        className={classNames(
          styles.masterAvatar,
          "h-4rem",
          "shadow-2",
          "mr-2"
        )}
      />
      <div>
        ({option.id})&nbsp;{option.name}&nbsp;{option.email}
      </div>
    </div>
  );

  const mainImageTemplate = (master: MasterInfoModel) => (
    <img
      src={master.mainImage}
      alt={master.mainImage}
      className={classNames(styles.masterAvatar, "h-4rem", "shadow-2")}
    />
  );

  if (loading) {
    return <Skeleton width="100%" height="512px" className="my-4" />;
  }

  if (!serviceInfo) {
    return <h3 className="my-4">Нет информации об услуге</h3>;
  }

  return (
    <div className={classNames(styles.container, "py-4", "grid")}>
      <h3>{serviceInfo.procedureName}</h3>
      <div className={classNames("col-12", "mt-2")}>
        <label className={styles.lightText} htmlFor="description">
          Описание (опционально)
        </label>
        <InputTextarea
          id="description"
          className={classNames(styles.input, "w-full", "mt-2")}
          value={serviceInfo.description}
          maxLength={256}
          rows={3}
        />
      </div>
      <div className={classNames("col-12", "lg:col-5", "xl:col-5", "py-4")}>
        <h3>Доступные мастера</h3>
        <Dropdown
          options={serviceInfo.availableMasters}
          optionLabel="name"
          placeholder="Выберите мастера"
          filter
          valueTemplate={selectedCountryTemplate}
          itemTemplate={countryOptionTemplate}
          className={classNames("w-full", "mt-4")}
          disabled={!serviceInfo.availableMasters.length}
        />
      </div>
      <div className={classNames("col-12", "lg:col-7", "xl:col-7", "py-4")}>
        <h3>Активные мастера</h3>
        <DataTable
          value={serviceInfo.activeMasters}
          className="mt-4"
          emptyMessage="Мастера не оказывают данную услугу."
          scrollable
          scrollHeight="640px"
        >
          <Column field="" header="Фото" body={mainImageTemplate} />
          <Column field="id" header="Код" />
          <Column field="name" header="Имя" />
          <Column field="email" header="Почта" />
          <Column field="price" header="Цена (BYN)" />
        </DataTable>
      </div>
      <Button className={classNames(styles.button, "w-full", "mt-4")}>
        Сохранить
      </Button>
    </div>
  );
};

export default memo(EditServiceScreen);
