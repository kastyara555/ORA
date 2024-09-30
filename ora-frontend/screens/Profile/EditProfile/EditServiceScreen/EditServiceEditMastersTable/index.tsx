import { FC, memo, useState } from "react";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import classNames from "classnames";

import {
  ActiveMasterInfoModel,
  MasterInfoModel,
  ServiceInfoModel,
  SubmitEditMasterData,
} from "@/screens/Profile/EditProfile/EditServiceScreen/types";

import styles from "./style.module.scss";

interface EditServiceEditMastersTableProps {
  serviceInfo: ServiceInfoModel;
  onUpdate: (master: SubmitEditMasterData) => void;
  onDelete: (id: number) => void;
}

const EditServiceEditMastersTable: FC<EditServiceEditMastersTableProps> = ({
  serviceInfo,
  onUpdate,
  onDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteColumnTemplate = (master: MasterInfoModel) => (
    <Button
      rounded
      outlined
      icon="pi pi-times"
      severity="danger"
      aria-label="Удалить"
      onClick={async () => {
        setLoading(true);
        await onDelete(master.id);
        setLoading(false);
      }}
      size="small"
    >
      &nbsp;Удалить
    </Button>
  );

  const mainImageTemplate = (master: MasterInfoModel) => (
    <img
      src={master.mainImage}
      alt={master.mainImage}
      className={classNames(styles.masterAvatar, "h-4rem", "w-4rem", "shadow-2")}
    />
  );

  const isPositiveNumber = (val: number) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
      return false;
    }

    str = str.replace(/^0+/, "") || "0";
    const n = Math.floor(Number(str));

    return n !== Infinity && n >= 0;
  };

  const onPriceEditComplete = async (e: ColumnEvent) => {
    const { rowData, newValue, originalEvent: event } = e;
    if (isPositiveNumber(newValue)) {
      setLoading(true);
      await onUpdate({ id: rowData.id, price: newValue });
      setLoading(false);
    } else {
      event.preventDefault();
    }
  };

  const priceEditor = (options: ColumnEditorOptions) => (
    <InputNumber
      value={options.value}
      onValueChange={(e) => options.editorCallback?.(e.value)}
      mode="currency"
      currency="BYN"
      locale="en-US"
    />
  );

  const priceBodyTemplate = (rowData: ActiveMasterInfoModel) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BYN",
    }).format(rowData.price);

  return (
    <DataTable
      value={serviceInfo.activeMasters}
      className="mt-4"
      emptyMessage="Мастера не оказывают данную услугу."
      scrollable
      scrollHeight="640px"
      editMode="cell"
      loading={loading}
    >
      <Column field="" header="Фото" body={mainImageTemplate} />
      <Column field="id" header="Код" />
      <Column field="name" header="Имя" />
      <Column field="email" header="Почта" />
      <Column
        field="price"
        header="Цена (BYN)"
        body={priceBodyTemplate}
        editor={(options) => priceEditor(options)}
        onCellEditComplete={onPriceEditComplete}
      />
      <Column
        field=""
        header=""
        headerStyle={{ width: "2rem" }}
        body={deleteColumnTemplate}
      />
    </DataTable>
  );
};

export default memo(EditServiceEditMastersTable);
