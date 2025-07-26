"use client"
import { FC } from "react";
import classNames from "classnames";
import { Divider } from "primereact/divider";
import { Map, Placemark, YMaps, ZoomControl } from "react-yandex-maps";

import { SaloonBaseDataModel } from "@/models/saloon";
import { BASE_STATIC_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { ZOOM_LEVELS } from "@/consts/maps";
import placemarkIcon from "@/public/assets/images/map/pin.png";

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
            ? BASE_STATIC_URL.concat(saloonData.mainImage)
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

    {!!(saloonData.yCoordinate && saloonData.xCoordinate) && <div className="mt-2">
      <YMaps>
        <Map
          width="100%"
          height={256}
          defaultState={{
            center: [saloonData.yCoordinate, saloonData.xCoordinate],
            zoom: ZOOM_LEVELS.STREET,
          }}
        >
          <ZoomControl />
          <Placemark
            geometry={[saloonData.yCoordinate, saloonData.xCoordinate]}
            options={{
              iconLayout: "default#image",
              iconImageHref: placemarkIcon.src,
              iconImageSize: [20, 32],
            }}
          />
        </Map>
      </YMaps>
    </div>}

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
