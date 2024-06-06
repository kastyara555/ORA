"use client"
import { FC } from "react";
import { useSelector } from "react-redux";

import { USER_TYPES } from "@/consts/profile";
import { profileUserDataSelector } from "@/store/profile/selectors";

import BookingHistoryClient from "./BookingHistoryClient";

const BookingHistoryScreen: FC = () => {
    const profileData = useSelector(profileUserDataSelector);

    if (profileData?.userType === USER_TYPES.client) {
        return <BookingHistoryClient />
    }

    return <>История бронирований недостуна</>
};

export default BookingHistoryScreen;
