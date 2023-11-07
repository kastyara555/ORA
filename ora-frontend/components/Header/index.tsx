"use client";
import { FC } from "react";
import { BiMenu, BiSolidUser } from "react-icons/bi";
import Link from "next/link";
import classNames from "classnames";

import styles from "./style.module.scss";

interface HeaderModel {
  withoutAuthorization: boolean;
}

const Header: FC<HeaderModel> = ({ withoutAuthorization }) => (
  <header className={styles.header}>
    <Link href="/">
      <h2>ORA</h2>
    </Link>

    {!withoutAuthorization && (
      <div className={classNames("flex", "align-items-center", "gap-3")}>
        <Link
          href="/registration/saloon"
          className={styles.saloonRegistrationLink}
        >
          Размещайтесь на ORA
        </Link>
        <Link href="/login" className={styles.linkToLogin}>
          <BiMenu color="white" />
          <BiSolidUser color="white" />
        </Link>
      </div>
    )}
  </header>
);

export default Header;
