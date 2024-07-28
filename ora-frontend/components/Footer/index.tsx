import { FC } from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./style.module.scss";

const Footer: FC = () => (
  <footer
    className={classNames(
      styles.header,
      "flex",
      "justify-content-center",
      "align-items-center"
    )}
  >
    <div
      className={classNames(styles.content, "flex", "justify-content-between")}
    >
      <Link href="/">
        <h2>ORA</h2>
      </Link>

      <div>
        <Link
          href="https://www.instagram.com/orabeauty.by"
          target="_blank"
          aria-label="Ссылка на инстаграм ora-beauty.by"
          className={styles.instagram}
        />
      </div>
    </div>
  </footer>
);

export default Footer;
