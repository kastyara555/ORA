import { Reducer, createReducer } from "@reduxjs/toolkit";
import { uniqueId } from "lodash";

import { CommonStoreModel } from "@/store/common/model";
import { initialCommonState } from "@/store/common/state";
import { commonSetUiToast } from "@/store/common/actions";

export const common: Reducer<CommonStoreModel> = createReducer(
  initialCommonState,
  (builder) =>
    builder.addCase(commonSetUiToast, (state, { payload }) => {
      state.ui.toast = { id: uniqueId(), content: payload };
    })
);
