import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance } from "@/api";
import { getCitiesUrl, getProcedureCategoriesUrl } from "@/api/categories";
import {
  RegistrationSaloonAboutFormModel,
  RegistrationSaloonAdressFormModel,
  RegistrationSaloonAdressTypeFormModel,
  RegistrationSaloonCategoriesFormModel,
  RegistrationSaloonEmailFormModel,
  RegistrationSaloonPasswordFormModel,
  RegistrationSaloonPicturesFormModel,
  RegistrationSaloonServicesFormModel,
  RegistrationSaloonStuffCountFormModel,
  RegistrationSaloonTimeFormModel,
  RegistrationSaloonVisitPaymentFormModel,
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

export const registrationSaloonSetCategoriesForm =
  createAction<RegistrationSaloonCategoriesFormModel>(
    "registrationSaloon/registrationSaloonSetCategoriesForm"
  );

export const registrationSaloonSetAdressTypeForm =
  createAction<RegistrationSaloonAdressTypeFormModel>(
    "registrationSaloon/registrationSaloonSetAdressTypeForm"
  );

export const registrationSaloonSetAdressForm =
  createAction<RegistrationSaloonAdressFormModel>(
    "registrationSaloon/registrationSaloonSetAdressForm"
  );

export const registrationSaloonSetStuffCountForm =
  createAction<RegistrationSaloonStuffCountFormModel>(
    "registrationSaloon/registrationSaloonSetStuffCountForm"
  );

export const registrationSaloonSetVisitPaymentForm =
  createAction<RegistrationSaloonVisitPaymentFormModel>(
    "registrationSaloon/registrationSaloonSetVisitPaymentForm"
  );

export const registrationSaloonSetTimeForm =
  createAction<RegistrationSaloonTimeFormModel>(
    "registrationSaloon/registrationSaloonSetTimeForm"
  );

export const registrationSaloonSetServicesForm =
  createAction<RegistrationSaloonServicesFormModel>(
    "registrationSaloon/registrationSaloonSetServicesForm"
  );

export const registrationSaloonSetPicturesForm =
  createAction<RegistrationSaloonPicturesFormModel>(
    "registrationSaloon/registrationSaloonSetPicturesForm"
  );
