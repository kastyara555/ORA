import { FC, ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import { AiOutlineArrowLeft } from "react-icons/ai";

import styles from "./style.module.scss";

interface ProfileWrapperProps {
  children?: ReactNode;
  title?: string;
  backHref?: string;
}

const ProfileWrapper: FC<ProfileWrapperProps> = ({
  children,
  title,
  backHref,
}) => (
  <div className={classNames(styles.profileWrapper, "px-4")}>
    {(backHref || title) && (
      <div className={classNames(styles.headingWrapper, "pt-1")}>
        {title && <h3 className="px-6">{title}</h3>}
        {backHref && (
          <Link href={backHref}>
            <AiOutlineArrowLeft
              className={classNames(styles.backButton, "py-2")}
            />
          </Link>
        )}
      </div>
    )}
    {children}
  </div>
);

export default ProfileWrapper;
