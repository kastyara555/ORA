import { FC } from "react";
import classNames from "classnames";
import { Card } from "primereact/card";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";

import { BASE_STATIC_URL } from "@/api";
import Button from "@/components/Button";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { ProcedureSaloonSaloonModel } from "@/models/procedure";
import { commonSetBookingModalData } from "@/store/common/actions";

import styles from "./style.module.scss";

interface ProcedureSaloonProps {
  isFavorite: boolean;
  saloonInfo: ProcedureSaloonSaloonModel;
  handleFavoritesClick(): void;
}

const ProcedureSaloon: FC<ProcedureSaloonProps> = ({ saloonInfo, isFavorite, handleFavoritesClick }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleRecord = () => {
    const splittedPathname = pathname.split("/");

    dispatch(
      commonSetBookingModalData({
        idSaloon: saloonInfo.id,
        idProcedure: +splittedPathname[2],
      })
    );
  };

  return (
    <Card className={styles.card}>
      <section className={classNames(styles.content, "w-full")}>
        <Link href={`/saloons/${saloonInfo.id}`} className={styles.link}>
          <div className={classNames("flex", "align-items-center")}>
            <img
              src={
                saloonInfo.mainImage
                  ? BASE_STATIC_URL.concat(saloonInfo.mainImage)
                  : DEFAULT_PROFILE_IMAGE
              }
              alt={saloonInfo.mainImage ?? "Главное изображение салона"}
              className={classNames(
                styles.saloonAvatar,
                "h-4rem",
                "w-4rem",
                "shadow-2",
                "mr-2"
              )}
            />
            <h3 className="ml-2">{saloonInfo.name}</h3>
          </div>
        </Link>

        <Button onClick={handleRecord} className={styles.chooseDataButton}>
          Выбрать дату
        </Button>
      </section>
      <Button
        className={styles.favoriteButton}
        icon={`pi ${isFavorite ? 'pi-heart-fill' : 'pi-heart'}`}
        severity="secondary"
        aria-label="Favorite"
        onClick={handleFavoritesClick}
        rounded
        text
      />
    </Card>
  );
};

export default ProcedureSaloon;
