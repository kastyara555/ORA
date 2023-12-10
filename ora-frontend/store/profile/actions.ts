import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/api";
import { getProfileInfoUrl } from "@/api/user";

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
