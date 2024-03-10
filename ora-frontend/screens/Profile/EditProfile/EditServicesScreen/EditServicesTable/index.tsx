"use client";

import { FC, memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { ServiceModel } from "@/screens/Profile/EditProfile/EditServicesScreen";

export interface EditServicesTableProps {
  services: ServiceModel[];
  loading: boolean;
  deleteService: (id: number) => void;
}

const EditServicesTable: FC<EditServicesTableProps> = ({
  services,
  loading,
  deleteService,
}) => {
  const router = useRouter();

  const editColumnTemplate = (service: ServiceModel) => (
    <Button
      rounded
      outlined
      icon="pi pi-spin pi-cog"
      severity="info"
      aria-label="Редактировать"
      onClick={() => router.push(`/profile/edit/services/${service.id}`)}
      size="small"
    >
      &nbsp;Редактировать
    </Button>
  );

  const deleteColumnTemplate = (service: ServiceModel) => (
    <Button
      rounded
      outlined
      icon="pi pi-times"
      severity="danger"
      aria-label="Удалить"
      onClick={() => deleteService(service.id)}
      size="small"
    >
      &nbsp;Удалить
    </Button>
  );

  return (
    <DataTable
      value={services}
      dataKey="id"
      emptyMessage="Услуги не найдены"
      scrollable
      scrollHeight="640px"
      loading={loading}
    >
      <Column field="name" header="Имя" />
      <Column
        field=""
        header=""
        headerStyle={{ width: "2rem" }}
        body={editColumnTemplate}
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

export default memo(EditServicesTable);
