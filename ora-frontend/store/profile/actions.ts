import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/api";
import { getProfileInfoUrl, updateProfileInfoUrl } from "@/api/user";
import { RootState } from "..";
import { profileEditClientForm } from "@/components/EditProfile/ClientEditProfile";
import { prepareProfileUpdateForm } from "@/store/profile/vendors";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";

export const resetProfileUserData = createAction(
  "profile/resetProfileUserData"
);

export const profileGetInfo = createAsyncThunk(
  "profile/profileGetInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getProfileInfoUrl);

      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const profileUpdate = createAsyncThunk<any, profileEditClientForm>(
  "profile/profileUpdate",
  async (formData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { profile } = getState() as RootState;

      const response = await axiosInstance.post(
        updateProfileInfoUrl.concat(`/${profile.userData?.userTypeMapId}`),
        prepareProfileUpdateForm(formData)
      );

      return response;
    } catch ({ response }: any) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Обновление профиля",
        detail: response.data,
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));

      return rejectWithValue(response);
    }
  }
);
