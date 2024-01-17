"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Link from "next/link";

import { BONUS_PROFILE_IMAGE, PROFILE_CLIENT_LINKS } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { Image } from "primereact/image";

import styles from "./style.module.scss";
import ProfileLink from "../ProfileLink";

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
        {PROFILE_CLIENT_LINKS.map(({ href, title, description }, index) => (
          <ProfileLink
            key={index}
            href={href}
            title={title}
            description={description}
          />
        ))}
      </div>
    </>
  );
};

export default ClientProfile;
