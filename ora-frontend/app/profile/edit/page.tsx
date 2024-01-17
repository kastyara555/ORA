import classNames from "classnames";

import EditProfile from "@/components/EditProfile";

import styles from "./page.module.scss";

const ProfileEditPage = () => (
  <div className={classNames(styles.profileWrapper, "px-4")}>
    <EditProfile />
  </div>
);

export default ProfileEditPage;
