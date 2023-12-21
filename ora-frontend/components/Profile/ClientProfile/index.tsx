"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Link from "next/link";

import { profileUserDateSelector } from "@/store/profile/selectors";
import { Image } from "primereact/image";
import { BONUS_PROFILE_IMAGE } from "@/consts/profile";

import styles from "./style.module.scss";

const ClientProfile = () => {
  const profileInfo = useSelector(profileUserDateSelector);

  return (
    <>
      <div
        className={classNames(
          "flex",
          "flex-wrap",
          "align-items-center",
          "justify-content-between",
          "py-4",
          "row-gap-3"
        )}
      >
        <div className={classNames("flex", "gap-3")}>
          <Image
            className={styles.profileImage}
            height="64"
            width="64"
            src={profileInfo.mainImage}
          />
          <div>
            <h2>
              {profileInfo.name} {profileInfo.lastName}
            </h2>
            <p>{profileInfo.email}</p>
          </div>
        </div>
        <div className={classNames("flex", "align-items-end", "gap-1")}>
          <Image height="24" src={BONUS_PROFILE_IMAGE} />
          <h3>
            <span className={styles.bonusCount}>{profileInfo.bonusCount}</span>
            /2000 баллов
          </h3>
        </div>
      </div>
      <div className={classNames("grid", "gap-2", "mt-4")}>
        <Link
          href="/profile/history"
          className={classNames(
            styles.linkBlock,
            "col-12",
            "xl:col",
            "lg:col",
            "py-2",
            "px-3"
          )}
        >
          <h3 className={styles.linkTitle}>История бронирования</h3>
          <p className={classNames('mt-4')}>Просматривайте и управляйте своими прошлыми и предстоящими бронированиями</p>
        </Link>
        <Link
          href="/profile/edit"
          className={classNames(
            styles.linkBlock,
            "col-12",
            "xl:col",
            "lg:col",
            "py-2",
            "px-3"
          )}
        >
          <h3 className={styles.linkTitle}>Настройки учетной записи</h3>
          <p className={classNames('mt-4')}>Редактируйте ваш профиль и контактную информацию</p>
        </Link>
        <Link
          href="/"
          className={classNames(
            styles.linkBlock,
            "col-12",
            "py-2",
            "px-3"
          )}
        >
          <h3 className={styles.linkTitle}>Пригласи друга и получи 5 рублей</h3>
          <p className={classNames('mt-4')}>Вы и приглашенные вами друзья получите скидку 5 рублей на ваши онлайн-бронирования и услуги</p>
        </Link>
      </div>
    </>
  );
};

export default ClientProfile;
