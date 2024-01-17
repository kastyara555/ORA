"use client";
import { FC } from "react";
import { BiMenu, BiSolidUser } from "react-icons/bi";
import Link from "next/link";
import classNames from "classnames";
import { useSelector } from "react-redux";

import { USER_TYPES } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";

import styles from "./style.module.scss";

interface HeaderModel {
  withoutAuthorization: boolean;
}

const Header: FC<HeaderModel> = ({ withoutAuthorization }) => {
  const profileInfo = useSelector(profileUserDataSelector);

  const isSaloon = profileInfo?.userType === USER_TYPES.saloon;

  return (
    <header className={styles.header}>
      <Link href="/">
        <h2>ORA</h2>
      </Link>

      {!withoutAuthorization && (
        <div className={classNames("flex", "align-items-center", "gap-3")}>
          {!isSaloon && (
            <Link
              href="/registration/saloon"
              className={styles.saloonRegistrationLink}
            >
              Размещайтесь на ORA
            </Link>
          )}
          {!profileInfo ? (
            <Link href="/login" className={styles.linkToLogin}>
              <BiMenu color="white" />
              <BiSolidUser color="white" />
            </Link>
          ) : (
            <Link href="/profile" className={styles.linkToLogin}>
              <BiSolidUser color="white" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
export default Header;
