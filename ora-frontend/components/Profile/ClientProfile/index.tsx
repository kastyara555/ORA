"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Image } from "primereact/image";

import { BONUS_PROFILE_IMAGE, PROFILE_CLIENT_LINKS } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";
import ProfileLink from "@/components/Profile/ProfileLink";

import styles from "./style.module.scss";

const ClientProfile = () => {
  const profileInfo = useSelector(profileUserDataSelector);

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
          <img
            src={profileInfo.mainImage}
            alt="Главное изображение клиента"
            className={classNames(
              styles.clientAvatar,
              "h-4rem",
              "w-4rem",
              "shadow-2",
            )}
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
        {PROFILE_CLIENT_LINKS.map(({ href, title, description, disabled = false }, index) => (
          <ProfileLink
            key={index}
            href={href}
            title={title}
            description={description}
            disabled={disabled}
          />
        ))}
      </div>
    </>
  );
};

export default ClientProfile;
