import classNames from "classnames";

import styles from "./page.module.scss";

const ProfileHistoryPage = () => (
  <div className={classNames(styles.profileWrapper, "px-4")}>
    История бронирования
  </div>
);

export default ProfileHistoryPage;
