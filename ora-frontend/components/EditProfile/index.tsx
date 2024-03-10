"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { USER_TYPES } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";
import ClientEditProfile from "@/components/EditProfile/ClientEditProfile";
import MasterEditProfile from "@/components/EditProfile/MasterEditProfile";
import SaloonEditProfile from "@/components/EditProfile/SaloonEditProfile";

const EditProfile = () => {
  const profileInfo = useSelector(profileUserDataSelector);

  const node = useMemo(() => {
    switch (profileInfo.userType) {
      case USER_TYPES.client:
        return <ClientEditProfile />;
      case USER_TYPES.master:
        return <MasterEditProfile />;
      case USER_TYPES.saloon:
        return <SaloonEditProfile />;
      default:
        return null;
    }
  }, [profileInfo]);

  return node;
};

export default EditProfile;
