"use client"
import { FC } from "react";
import classNames from "classnames";
import { Divider } from "primereact/divider";
import Link from "next/link";

import { BASE_STATIC_URL } from "@/api";
import Button from "@/components/Button";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { FavoriteServiceModel } from "@/models/favorites";

import styles from './style.module.scss';

interface FavoriteServiceProps {
  service: FavoriteServiceModel;
  isFavorite: boolean;
  handleRecord(): void;
  toggleFavorite(): void;
}

const FavoriteService: FC<FavoriteServiceProps> = ({ isFavorite, service: { saloonId, saloonName, procedureName, mainImage, cityName }, handleRecord, toggleFavorite }) => (
  <>
    <div className={classNames(styles.saloon, styles.saloonDesktop, "flex", "align-items-center", "p-3", "gap-2")}>
      <Link href={`/saloons/${saloonId}`} className={styles.link}>
        <img
          src={
            mainImage
              ? BASE_STATIC_URL.concat(mainImage)
              : DEFAULT_PROFILE_IMAGE
          }
          alt={mainImage ?? "Главное изображение салона"}
          className={classNames(
            styles.saloonAvatar,
            "h-3rem",
            "w-3rem",
            "shadow-2",
            "mr-2"
          )}
        />
        <div>
          <h3>{saloonName}</h3>
          <h4>г.{cityName}</h4>
        </div>
      </Link>
      <Divider layout="vertical" />
      <h3 className="flex-1">{procedureName}</h3>
      <Button onClick={handleRecord}>
        Выбрать дату
      </Button>
      <Button
        className={styles.favoriteButton}
        icon={`pi ${isFavorite ? 'pi-heart-fill' : 'pi-heart'}`}
        severity="secondary"
        aria-label="Favorite"
        onClick={toggleFavorite}
        rounded
        text
      />
    </div>

    <div className={classNames(styles.saloon, styles.saloonMobile, "flex", "flex-column", "p-3")}>
      <div className={classNames("flex", "justify-content-between")}>
        <Link href={`/saloons/${saloonId}`} className={styles.link}>
          <img
            src={
              mainImage
                ? BASE_STATIC_URL.concat(mainImage)
                : DEFAULT_PROFILE_IMAGE
            }
            alt={mainImage ?? "Главное изображение салона"}
            className={classNames(
              styles.saloonAvatar,
              "h-3rem",
              "w-3rem",
              "shadow-2",
              "mr-2"
            )}
          />
          <div>
            <h3>{saloonName}</h3>
            <h4>г.{cityName}</h4>
          </div>
        </Link>
        <Button
          className={styles.favoriteButton}
          icon={`pi ${isFavorite ? 'pi-heart-fill' : 'pi-heart'}`}
          severity="secondary"
          aria-label="Favorite"
          onClick={toggleFavorite}
          rounded
          text
        />
      </div>
      <Divider />
      <h4 className="flex-1">{procedureName}</h4>
      <Divider />
      <Button onClick={handleRecord}>
        Выбрать дату
      </Button>
    </div>
  </>
);

export default FavoriteService;
