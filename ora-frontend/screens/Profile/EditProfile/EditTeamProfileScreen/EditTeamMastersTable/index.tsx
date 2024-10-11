import { memo, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";

import axiosInstance, { BASE_URL_BACK } from "@/api";
import { getSaloonMastersUrl, deleteSaloonMastersUrl } from "@/api/saloon";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { commonSetUiToast } from "@/store/common/actions";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface MasterModel {
  code: number;
  name: string;
  email: string;
  phone: string;
  mainImage: string | null;
}

const EditTeamMastersTable = () => {
  const { userTypeMapId } = useSelector(profileUserDataSelector);
  const [masters, setMasters] = useState<MasterModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMasters, setSelectedMasters] = useState<
    DataTableSelection<MasterModel[]>
  >([]);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        getSaloonMastersUrl(userTypeMapId),
        {}
      );
      setMasters(data);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка загрузки мастеров",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setSelectedMasters([]);
      setLoading(false);
    }
  }, []);

  const deleteMasters = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        deleteSaloonMastersUrl(userTypeMapId),
        {
          codes: (selectedMasters as MasterModel[]).map(({ code }) => code),
        }
      );
      setMasters(data);
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.SUCCESS,
        summary: "Профиль",
        detail: "Мастер(-а) успешно удалён(-ены)",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
      setSelectedMasters([]);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Профиль",
        detail: "Ошибка удаления мастера(-ов)",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setLoading(false);
    }
  }, [selectedMasters]);

  const mainImageTemplate = (master: MasterModel) => {
    const imageUrl = master.mainImage
      ? BASE_URL_BACK.concat(master.mainImage)
      : DEFAULT_PROFILE_IMAGE;

    return (
      <img
        src={imageUrl}
        alt={imageUrl}
        className={classNames(styles.masterAvatar, "h-4rem", "w-4rem", "shadow-2")}
      />
    );
  };

  return (
    <DataTable
      value={masters}
      header={
        <Button
          severity="secondary"
          outlined
          disabled={!(selectedMasters as MasterModel[]).length}
          onClick={deleteMasters}
          size="small"
        >
          Удалить выбранных
        </Button>
      }
      selectionMode="checkbox"
      selection={selectedMasters}
      onSelectionChange={(e) => setSelectedMasters(e.value)}
      dataKey="code"
      emptyMessage="Мастера не найдены"
      scrollable
      scrollHeight="640px"
      loading={loading}
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
      <Column field="code" header="Код" />
      <Column field="name" header="Имя" />
      <Column field="email" header="Почта" />
      <Column field="phone" header="Телефон" />
      <Column field="" header="Фото" body={mainImageTemplate} />
    </DataTable>
  );
};

export default memo(EditTeamMastersTable);
