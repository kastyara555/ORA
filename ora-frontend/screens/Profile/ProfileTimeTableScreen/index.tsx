"use client"
import { FC } from "react";
import { useSelector } from "react-redux";

import { USER_TYPES } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";

import EditMasterTimetableDetails from "./EditMasterTimetableDetails";
import SaloonTimetableDetails from "./SaloonTimetableDetails";

interface ProfileTimeTableScreenProps {
    date: moment.Moment;
}

const ProfileTimeTableScreen: FC<ProfileTimeTableScreenProps> = ({ date }) => {
  const profileData = useSelector(profileUserDataSelector);

  if (profileData?.userType === USER_TYPES.master) {
    return <EditMasterTimetableDetails date={date} />
  }

  if (profileData?.userType === USER_TYPES.saloon) {
    return <SaloonTimetableDetails date={date} />
  }

  return <>История бронирований недостуна</>
};

export default ProfileTimeTableScreen;
