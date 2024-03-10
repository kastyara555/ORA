import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/api";
import { getProfileInfoUrl } from "@/api/user";
import { RootState } from "@/store";
import { profileEditClientForm } from "@/components/EditProfile/ClientEditProfile";
import { profileEditMasterForm } from "@/components/EditProfile/MasterEditProfile";
import { profileEditSaloonForm } from "@/components/EditProfile/SaloonEditProfile";
import {
  prepareClientUpdateForm,
  prepareMasterUpdateForm,
  prepareSaloonUpdateForm,
} from "@/store/profile/vendors";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { clientUpdateUrl } from "@/api/client";
import { masterUpdateUrl } from "@/api/master";
import { saloonUpdateUrl } from "@/api/saloon";
import { USER_TYPES } from "@/consts/profile";

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

export const profileUpdate = createAsyncThunk<
  any,
  profileEditClientForm | profileEditMasterForm | profileEditSaloonForm
>(
  "profile/profileUpdate",
  async (formData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { profile } = getState() as RootState;
      let requestConfig: null | {
        url: string;
        payload: profileEditClientForm | profileEditMasterForm;
      } = null;

      if (
        profile.userData?.userType === USER_TYPES.client &&
        profile.userData?.userTypeMapId
      ) {
        requestConfig = {
          url: clientUpdateUrl(profile.userData.userTypeMapId),
          payload: prepareClientUpdateForm(formData as profileEditClientForm),
        };
      }

      if (
        profile.userData?.userType === USER_TYPES.master &&
        profile.userData?.userTypeMapId
      ) {
        requestConfig = {
          url: masterUpdateUrl(profile.userData.userTypeMapId),
          payload: prepareMasterUpdateForm(formData as profileEditMasterForm),
        };
      }

      if (
        profile.userData?.userType === USER_TYPES.saloon &&
        profile.userData?.userTypeMapId
      ) {
        requestConfig = {
          url: saloonUpdateUrl(profile.userData.userTypeMapId),
          payload: prepareSaloonUpdateForm(formData as profileEditSaloonForm),
        };
      }

      if (requestConfig) {
        const response = await axiosInstance.post(
          requestConfig.url,
          requestConfig.payload
        );

        const toastToBeShown = {
          severity: TOAST_SEVERITIES.SUCCESS,
          summary: "Обновление профиля",
          detail: "Профиль успешно обновлён.",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));

        return response;
      }

      return null;
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
