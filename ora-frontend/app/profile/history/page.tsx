"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";

import { profileUserDateSelector } from "@/store/profile/selectors";

import styles from "./page.module.scss";

const ProfileHistoryPage = () => {
  const profileInfo = useSelector(profileUserDateSelector);

  if (!profileInfo) return null;

  return (
    <div className={classNames(styles.profileWrapper, "px-4")}>
      История бронирования
    </div>
  );
};

export default ProfileHistoryPage;
