"use client";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import BookingSidebar from "@/components/BookingSidebar";
import { commonBookingModalDataSelector } from "@/store/common/selectors";
import { commonSetBookingModalData } from "@/store/common/actions";

const ModalManager: FC = () => {
  const bookingSidebarData = useSelector(commonBookingModalDataSelector);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(commonSetBookingModalData(null));

  return <BookingSidebar data={bookingSidebarData} onClose={handleClose} />;
};

export default ModalManager;
