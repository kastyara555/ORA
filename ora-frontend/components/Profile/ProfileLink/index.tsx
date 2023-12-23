import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

import styles from "./style.module.scss";

export interface ProfileLinkModel {
  href: string;
  title: string;
  description: string;
}

const ProfileLink: FC<ProfileLinkModel> = ({ href, title, description }) => (
  <Link
    href={href}
    className={classNames(
      styles.linkBlock,
      "col-12",
      "xl:col",
      "lg:col",
      "py-2",
      "px-3"
    )}
  >
    <h3 className={styles.linkTitle}>{title}</h3>
    <p className={classNames("mt-4")}>{description}</p>
  </Link>
);

export default ProfileLink;
