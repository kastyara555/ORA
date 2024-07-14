"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";

import { profileUserDataSelector } from "@/store/profile/selectors";
import ProfileLink from "@/components/Profile/ProfileLink";
import { PROFILE_SALOON_LINKS } from "@/consts/profile";
import { Image } from "primereact/image";

import styles from "./style.module.scss";

const SaloonProfile = () => {
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
              styles.saloonAvatar,
              "h-4rem",
              "w-4rem",
              "shadow-2",
            )}
          />
          <div>
            <h2>{profileInfo.saloonName}</h2>
            <p>{profileInfo.email}</p>
          </div>
        </div>
      </div>
      <div className={classNames("grid", "gap-2", "mt-4")}>
        {PROFILE_SALOON_LINKS.map(
          ({ href, title, description, disabled = false }, index) => (
            <ProfileLink
              key={index}
              href={href}
              title={title}
              description={description}
              disabled={disabled}
            />
          )
        )}
      </div>
    </>
  );
};

export default SaloonProfile;
