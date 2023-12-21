"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { profileUserDateSelector } from "@/store/profile/selectors";
import ClientEditProfile from "@/components/EditProfile/ClientEditProfile";
import { USER_TYPES } from "@/consts/profile";

const EditProfile = () => {
  const profileInfo = useSelector(profileUserDateSelector);

  const node = useMemo(() => {
    switch (profileInfo.userType) {
      case USER_TYPES.client:
        return <ClientEditProfile />
      default:
        return null
    }
  }, [profileInfo])

  return node;
};

export default EditProfile;
