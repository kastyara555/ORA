import { FC } from "react";
import classNames from "classnames";

import { SaloonBaseDataModel } from "@/models/saloon";
import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import styles from "./style.module.scss";

interface SaloonScreenProps {
  saloonData: SaloonBaseDataModel;
}

const SaloonScreen: FC<SaloonScreenProps> = ({ saloonData }) => (
  <div>
    <div className={classNames("flex")}>
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
  </div>
);

export default SaloonScreen;
