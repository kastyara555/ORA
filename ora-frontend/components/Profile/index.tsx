import { useMemo } from "react";
import { useSelector } from "react-redux";

import { profileUserDataSelector } from "@/store/profile/selectors";
import ClientProfile from "@/components/Profile/ClientProfile";
import MasterProfile from "@/components/Profile/MasterProfile";
import SaloonProfile from "@/components/Profile/SaloonProfile";
import { USER_TYPES } from "@/consts/profile";

const Profile = () => {
  const profileInfo = useSelector(profileUserDataSelector);

  const node = useMemo(() => {
    switch (profileInfo.userType) {
      case USER_TYPES.client:
        return <ClientProfile />;
      case USER_TYPES.master:
        return <MasterProfile />;
      case USER_TYPES.saloon:
        return <SaloonProfile />;
      default:
        return null;
    }
  }, [profileInfo]);

  return node;
};

export default Profile;
