"use client";
import { useDispatch } from "react-redux";
import storage from "redux-persist/lib/storage";
import { useRouter } from "next/navigation";

import ContentWrapper from "@/components/ContentWrapper";
import { resetProfileUserData } from "@/store/profile/actions";
import { deleteCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import Profile from "@/components/Profile";
import Button from "@/components/Button";

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
    <ContentWrapper>
      <Profile />
      <Button
        className="my-4"
        onClick={handleLogout}
        severity="secondary"
        outlined
      >
        Выйти
      </Button>
    </ContentWrapper>
  );
};

export default ProfilePage;
