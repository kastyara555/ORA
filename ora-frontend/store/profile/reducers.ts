import { Reducer, createReducer } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

import { ProfileStoreModel } from "@/store/profile/model";
import {
  profileGetInfo,
  profileUpdate,
  resetProfileUserData,
} from "@/store/profile/actions";
import { initialProfileState } from "@/store/profile/state";
import { getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

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
        state.userData = {
          ...payload.data,
          mainImage: payload.data.mainImage
            ? BASE_URL.concat(payload.data.mainImage)
            : DEFAULT_PROFILE_IMAGE,
        };
      })
      .addCase(profileUpdate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userData = {
          ...payload.data,
          mainImage: payload.data.mainImage
            ? BASE_URL.concat(payload.data.mainImage)
            : DEFAULT_PROFILE_IMAGE,
        };
      })
      .addCase(profileUpdate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(profileUpdate.pending, (state) => {
        state.loading = true;
      })
);
