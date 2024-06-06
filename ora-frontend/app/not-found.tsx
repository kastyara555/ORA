import classNames from "classnames";
import Link from "next/link";

import styles from './not-found.module.scss';

const NotFound = () => (
  <div className={classNames("mt-4", "ml-4")}>
    <h2>Страница не найдена.</h2>
    <p>Возможно, Вы заблудились.</p>
    <Link className={styles.link} href="/">Перейти на главную страницу</Link>
  </div>
);

export default NotFound;
