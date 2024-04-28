import { FC, ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import { AiOutlineArrowLeft } from "react-icons/ai";

import styles from "./style.module.scss";

interface ContentWrapperProps {
  children?: ReactNode;
  title?: string;
  backHref?: string;
}

const ContentWrapper: FC<ContentWrapperProps> = ({
  children,
  title,
  backHref,
}) => (
  <div className={classNames(styles.contentWrapper, "px-4")}>
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

export default ContentWrapper;
