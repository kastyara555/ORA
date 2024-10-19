import { FC } from "react";
import { BiSolidUser } from "react-icons/bi";
import Link from "next/link";
import classNames from "classnames";
import { useSelector } from "react-redux";

import { LOGO_IMAGE } from "@/consts";
import { profileUserDataSelector } from "@/store/profile/selectors";

import styles from "./style.module.scss";

interface HeaderModel {
  withoutAuthorization: boolean;
}

const Header: FC<HeaderModel> = ({ withoutAuthorization }) => {
  const profileInfo = useSelector(profileUserDataSelector);

  return (
    <header className={styles.header}>
      <Link href="/">
        <img height={52} src={LOGO_IMAGE} alt="ORA - Находи и бронируй запись у профессионалов бьюти индустрии" />
      </Link>

      {!withoutAuthorization && (
        <div className={classNames("flex", "align-items-center", "gap-3")}>
          {!profileInfo ? (
            <>
              <Link
                href="/registration/saloon"
                className={styles.saloonRegistrationLink}
              >
                Размещайтесь на ORA
              </Link>
              <Link href="/profile" className={styles.linkToLogin}>Войти</Link>
            </>
          ) : (
            <Link href="/profile" className={styles.linkToLogin}>
              <div><BiSolidUser color="white" /></div>&nbsp;<p>{profileInfo.name}</p>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
export default Header;
