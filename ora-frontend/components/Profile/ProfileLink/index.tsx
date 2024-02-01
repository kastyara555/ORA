import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

import styles from "./style.module.scss";

export interface ProfileLinkModel {
  href: string;
  title: string;
  description: string;
  disabled?: boolean;
}

const ProfileLink: FC<ProfileLinkModel> = ({
  href,
  title,
  description,
  disabled,
}) => {
  const baseProps = {
    className: classNames(
      styles.linkBlock,
      "col-12",
      "xl:col",
      "lg:col",
      "py-2",
      "px-3"
    ),
  };

  const content = (
    <>
      <h3 className={styles.linkTitle}>{title}</h3>
      <p className={classNames("mt-4")}>{description}</p>
    </>
  );

  return disabled ? (
    <div
      {...baseProps}
      className={classNames(baseProps.className, styles.disabled)}
    >
      {content}
    </div>
  ) : (
    <Link {...baseProps} href={href}>
      {content}
    </Link>
  );
};

export default ProfileLink;
