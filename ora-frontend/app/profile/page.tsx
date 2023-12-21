"use client";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import classNames from "classnames";

import { profileUserDateSelector } from "@/store/profile/selectors";
import { resetProfileUserData } from "@/store/profile/actions";
import { deleteCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import Profile from "@/components/Profile";

import styles from "./page.module.scss";

const ProfilePage = () => {
  const profileInfo = useSelector(profileUserDateSelector);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(resetProfileUserData());
    deleteCookie(AUTH_COOKIE_NAME);
    router.push("/");
  };

  if (!profileInfo) return null;

  return (
    <div className={classNames(styles.profileWrapper, "px-4")}>
      <Profile />
      <Button className={classNames("mt-4")} onClick={handleLogout} outlined>
        Выйти
      </Button>
    </div>
  );
};

export default ProfilePage;
