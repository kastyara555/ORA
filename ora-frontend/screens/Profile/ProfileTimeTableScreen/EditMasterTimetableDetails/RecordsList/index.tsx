import { FC, memo } from "react";
import classNames from "classnames";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { BASE_STATIC_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import { CreateServiceTimetableModel } from "../types";
import styles from "./style.module.scss";

interface RecordsListProps {
  serviceInstances: CreateServiceTimetableModel[];
  onCancel: (id: number) => void;
}

const RecordsList: FC<RecordsListProps> = ({ serviceInstances, onCancel }) =>
  serviceInstances.length ? (
    <>
      {serviceInstances.map(({ id, name, time, saloon, statusName }) => (
        <Card
          key={id}
          pt={{ content: { className: "p-0" } }}
          title={
            <div className={classNames("flex", "justify-content-between")}>
              {time}&nbsp;
              <Button
                rounded
                outlined
                text
                icon="pi pi-times"
                severity="danger"
                aria-label="Отменить"
                className={classNames("h-2rem", "w-2rem")}
                onClick={() => onCancel(id)}
              />
            </div>
          }
          className="m-1"
        >
          <div className="flex align-items-center">
            <img
              src={
                saloon.mainImage
                  ? BASE_STATIC_URL.concat(saloon.mainImage)
                  : DEFAULT_PROFILE_IMAGE
              }
              alt={saloon.mainImage ?? "Главное изображение салона"}
              className={classNames(
                styles.saloonAvatar,
                "h-2rem",
                "w-2rem",
                "shadow-2",
                "mr-2"
              )}
            />
            <div>{saloon.name}</div>
          </div>
          <Divider className="my-2" />
          <p className="m-0">Услуга: {name}</p>
          <Divider className="my-2" />
          <p className="m-0">Статус: {statusName}</p>
        </Card>
      ))}
    </>
  ) : (
    <h3>Записи отсутствуют</h3>
  );

export default memo(RecordsList);
