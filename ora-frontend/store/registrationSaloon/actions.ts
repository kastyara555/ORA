import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/api";
import { getCitiesUrl, getProcedureCategoriesUrl } from "@/api/categories";
import { postSaloonRegistrationUrl } from "@/api/registration";
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
import { RootState } from "@/store";
import { prepareSaloonRegistrationForm } from "@/store/registrationSaloon/vendors";
import { commonSetUiToast } from "@/store/common/actions";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";

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

export const registrationSaloonPostForm = createAsyncThunk(
  "registrationSaloon/registrationSaloonPostForm",
  async (_, { getState, dispatch }) => {
    const { registrationSaloon } = getState() as RootState;

    await axiosInstance
      .post(
        postSaloonRegistrationUrl,
        prepareSaloonRegistrationForm(registrationSaloon.selectedValues)
      )
      .then(() => {
        dispatch(registrationSaloonResetForm());

        window.location.pathname = "/login";
      })
      .catch(({ response }) => {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.ERROR,
          summary: "Регистрация",
          detail: response.data,
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      });
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

export const registrationSaloonResetForm = createAction(
  "registrationSaloon/registrationSaloonResetForm"
);
