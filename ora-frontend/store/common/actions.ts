import { createAction } from "@reduxjs/toolkit";

import { BookingSidebarDataModel } from "@/store/common/model";

export const commonSetUiToast = createAction<any>("common/commonSetUiToast");

export const commonSetBookingModalData =
  createAction<BookingSidebarDataModel | null>(
    "common/commonSetBookingModalData"
  );
