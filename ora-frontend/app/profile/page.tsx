"use client";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

import { profileUserDateSelector } from "@/store/profile/selectors";
import { resetProfileUserData } from "@/store/profile/actions";
import { deleteCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";

import styles from "./page.module.scss";

const Profile = () => {
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
    <div>
      <h2>Привет, {profileInfo.name}</h2>
      <h3>{profileInfo.email}</h3>
      <h3>{profileInfo.phone}</h3>
      <h3>{profileInfo.hash}</h3>
      <h3>{profileInfo.bonusCount} бонусов</h3>
      <Button onClick={handleLogout} outlined>
        Выйти
      </Button>
    </div>
  );
};

export default Profile;
