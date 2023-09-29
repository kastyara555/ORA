import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance } from "@/api";
import { getCitiesUrl, getProcedureCategoriesUrl } from "@/api/categories";
import {
  RegistrationSaloonAboutFormModel,
  RegistrationSaloonEmailFormModel,
  RegistrationSaloonPasswordFormModel,
} from "@/models/SaloonRegistration";

export const registrationSaloonFetchCategories = createAsyncThunk(
  "registrationSaloon/registrationSaloonFetchCategories",
  async () => {
    const { data } = await axiosInstance(getProcedureCategoriesUrl);

    return data ?? [];
  }
);

export const registrationSaloonFetchCities = createAsyncThunk(
  "registrationSaloon/registrationSaloonFetchCities",
  async () => {
    const { data } = await axiosInstance(getCitiesUrl);

    return data ?? [];
  }
);

export const registrationSaloonSetEmailForm =
  createAction<RegistrationSaloonEmailFormModel>(
    "registrationSaloon/registrationSaloonSetEmailForm"
  );

export const registrationSaloonSetAboutForm =
  createAction<RegistrationSaloonAboutFormModel>(
    "registrationSaloon/registrationSaloonSetAboutForm"
  );

export const registrationSaloonSetPasswordForm =
  createAction<RegistrationSaloonPasswordFormModel>(
    "registrationSaloon/registrationSaloonSetPasswordForm"
  );
