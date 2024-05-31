import { FC } from "react";
import classNames from "classnames";

import { SaloonBaseDataModel } from "@/models/saloon";
import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import SaloonWorkingTime from "./SaloonWorkingTime";
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
            ? BASE_URL.concat(saloonData.mainImage)
            : DEFAULT_PROFILE_IMAGE
        }
        alt={saloonData.mainImage ?? "Главное изображение салона"}
        className={classNames(
          styles.saloonAvatar,
          "h-8rem",
          "w-8rem",
          "shadow-2",
          "mr-2"
        )}
      />
      <div className="ml-2">
        <h1>{saloonData.name}</h1>
        <p dangerouslySetInnerHTML={{ __html: saloonData.description }} />
      </div>
    </div>
    <div className={classNames("mt-4", "grid", "w-full")}>
      <div className={classNames("col-12", "md:col-6", "lg:col-4", "xl:col-4")}>
        <h2>Город:&nbsp;{saloonData.cityName}</h2>
      </div>
      <div className={classNames("col-12", "md:col-6", "lg:col-8", "xl:col-8")}>
        <h2>
          Адрес:&nbsp;
          {saloonData.street && saloonData.building
            ? `${saloonData.streetType} ${saloonData.street} ${
                saloonData.building
              }${saloonData.office ? `, оф. ${saloonData.office}` : ""}${
                saloonData.stage ? `, эт. ${saloonData.stage}` : ""
              }`
            : "По выезду"}
        </h2>
      </div>
      <div className={classNames("col-12", "md:col-6", "lg:col-4", "xl:col-4")}>
        <h2>График работы:</h2>
        <SaloonWorkingTime timeTable={JSON.parse(saloonData.workingTime)} />
      </div>
      <div className={classNames("col-12", "md:col-6", "lg:col-8", "xl:col-8")}>
        <h2>Услуги:</h2>
      </div>
    </div>
  </div>
);

export default SaloonScreen;
