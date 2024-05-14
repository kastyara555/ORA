import { createAction } from "@reduxjs/toolkit";

import { BookingBannerDataModel } from "@/store/common/model";

export const commonSetUiToast = createAction<any>("common/commonSetUiToast");

export const commonSetBookingModalData =
  createAction<BookingBannerDataModel | null>(
    "common/commonSetBookingModalData"
  );
