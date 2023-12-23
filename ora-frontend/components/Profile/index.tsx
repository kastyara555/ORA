"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { profileUserDateSelector } from "@/store/profile/selectors";
import ClientProfile from "@/components/Profile/ClientProfile";
import SaloonProfile from "@/components/Profile/SaloonProfile";
import { USER_TYPES } from "@/consts/profile";

const Profile = () => {
  const profileInfo = useSelector(profileUserDateSelector);

  const node = useMemo(() => {
    switch (profileInfo.userType) {
      case USER_TYPES.client:
        return <ClientProfile />;
      case USER_TYPES.saloon:
        return <SaloonProfile />;
      default:
        return null;
    }
  }, [profileInfo]);

  return node;
};

export default Profile;
