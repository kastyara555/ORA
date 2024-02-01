"use client";
import { useDispatch } from "react-redux";
import storage from "redux-persist/lib/storage";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import classNames from "classnames";

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import { resetProfileUserData } from "@/store/profile/actions";
import { deleteCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import Profile from "@/components/Profile";

import styles from "./page.module.scss";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(resetProfileUserData());
    await storage.removeItem("root");
    deleteCookie(AUTH_COOKIE_NAME);
    router.push("/");
  };

  return (
    <ProfileWrapper>
      <Profile />
      <Button
        className={classNames(styles.outlinedButton, "my-4")}
        onClick={handleLogout}
        outlined
      >
        Выйти
      </Button>
    </ProfileWrapper>
  );
};

export default ProfilePage;
