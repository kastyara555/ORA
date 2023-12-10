import { Reducer, createReducer } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import { ProfileStoreModel } from "@/store/profile/model";
import { profileGetInfo, resetProfileUserData } from "@/store/profile/actions";
import { initialProfileState } from "@/store/profile/state";
import { getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";

export const profile: Reducer<ProfileStoreModel> = createReducer(
  initialProfileState,
  (builder) =>
    builder
      .addCase(REHYDRATE, (state, { payload }: any) => {
        const authCookie = getCookie(AUTH_COOKIE_NAME);

        if (payload?.profile?.userData && authCookie && authCookie.length) {
          state.userData = { ...payload.profile.userData };
        }
      })
      .addCase(resetProfileUserData, (state) => {
        state.userData = null;
      })
      .addCase(profileGetInfo.fulfilled, (state, { payload }) => {
        state.userData = payload.data;
      })
);
