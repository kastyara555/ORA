"use client"
import { FC } from "react";
import classNames from "classnames";
import { Divider } from "primereact/divider";

import { SaloonBaseDataModel } from "@/models/saloon";
import { DEFAULT_BASE_URL_BACK } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import SaloonWorkingTime from "./SaloonWorkingTime";
import SaloonServices from "./SaloonServices";
import styles from "./style.module.scss";

interface SaloonScreenProps {
  saloonData: SaloonBaseDataModel;
}

const SaloonScreen: FC<SaloonScreenProps> = ({ saloonData }) => (
  <div>
    <div className="flex">
      <img
        src={
          saloonData.mainImage
            ? DEFAULT_BASE_URL_BACK.concat(saloonData.mainImage)
            : DEFAULT_PROFILE_IMAGE
        }
        alt={saloonData.mainImage ?? "Главное изображение салона"}
        className={classNames(
          styles.saloonAvatar,
          "h-6rem",
          "w-6rem",
          "shadow-2",
          "mr-2"
        )}
      />
      <div className="ml-2">
        <h1>{saloonData.name}</h1>
        <p dangerouslySetInnerHTML={{ __html: saloonData.description }} />
      </div>
    </div>

    <h2 className="mt-6">
      Адрес:&nbsp;
      г.{saloonData.cityName},&nbsp;
      {saloonData.street && saloonData.building
        ? `${saloonData.streetType?.toLowerCase()} ${saloonData.street} ${saloonData.building
        }${saloonData.office ? `, оф. ${saloonData.office}` : ""}${saloonData.stage ? `, эт. ${saloonData.stage}` : ""
        }`
        : "По выезду"}
    </h2>

    <Divider />

    <div>
      <h2>Время работы:</h2>
      <SaloonWorkingTime timeTable={JSON.parse(saloonData.workingTime)} />
    </div>

    <Divider />

    <h2>Услуги:</h2>
    <div className={classNames("w-full", "mt-2")}>
      <SaloonServices idSaloon={saloonData.id} />
    </div>
  </div>
);

export default SaloonScreen;
