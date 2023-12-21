"use client";
import { useSelector } from "react-redux";
import classNames from "classnames";

import { profileUserDateSelector } from "@/store/profile/selectors";
import EditProfile from "@/components/EditProfile";

import styles from "./page.module.scss";

const ProfileEditPage = () => {
  const profileInfo = useSelector(profileUserDateSelector);

  if (!profileInfo) return null;

  return (
    <div className={classNames(styles.profileWrapper, "px-4")}>
      <EditProfile />
    </div>
  );
};

export default ProfileEditPage;
