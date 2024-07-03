import { Reducer, createReducer } from "@reduxjs/toolkit";

import { initialRegistrationSaloonState } from "@/store/registrationSaloon/state";
import { RegistrationSaloonStoreModel } from "@/store/registrationSaloon/model";
import {
  registrationSaloonFetchCategories,
  registrationSaloonFetchCities,
  registrationSaloonFetchStreetTypes,
  registrationSaloonPostForm,
  registrationSaloonResetForm,
  registrationSaloonSetAboutForm,
  registrationSaloonSetAdressForm,
  registrationSaloonSetAdressTypeForm,
  registrationSaloonSetEmailForm,
  registrationSaloonSetPasswordForm,
  registrationSaloonSetPicturesForm,
  registrationSaloonSetServicesForm,
  registrationSaloonSetStuffCountForm,
  registrationSaloonSetTimeForm,
  registrationSaloonSetVisitPaymentForm,
} from "@/store/registrationSaloon/actions";
import {
  ABOUT_FORM_INITIAL_STATE,
  ADRESS_FORM_INITIAL_STATE,
  ADRESS_TYPE_FORM_INITIAL_STATE,
  EMAIL_FORM_INITIAL_STATE,
  PASSWORD_FORM_INITIAL_STATE,
  PICTURES_FORM_INITIAL_STATE,
  SERVICES_FORM_INITIAL_STATE,
  STUFF_COUNT_FORM_INITIAL_STATE,
  TIME_FORM_INITIAL_STATE,
  VISIT_PAYMENT_FORM_INITIAL_STATE,
} from "@/consts/registration";

export const registrationSaloon: Reducer<RegistrationSaloonStoreModel> =
  createReducer(initialRegistrationSaloonState, (builder) =>
    builder
      .addCase(registrationSaloonSetEmailForm, (state, { payload }) => {
        state.selectedValues.emailForm = payload;
      })
      .addCase(registrationSaloonSetAboutForm, (state, { payload }) => {
        state.selectedValues.aboutForm = payload;
      })
      .addCase(registrationSaloonSetPasswordForm, (state, { payload }) => {
        state.selectedValues.passwordForm = payload;
      })
      .addCase(registrationSaloonSetAdressTypeForm, (state, { payload }) => {
        state.selectedValues.adressTypeForm = payload;
      })
      .addCase(registrationSaloonSetAdressForm, (state, { payload }) => {
        state.selectedValues.adressForm = payload;
      })
      .addCase(registrationSaloonSetStuffCountForm, (state, { payload }) => {
        state.selectedValues.stuffCountForm = payload;
      })
      .addCase(registrationSaloonSetVisitPaymentForm, (state, { payload }) => {
        state.selectedValues.visitPaymentForm = payload;
      })
      .addCase(registrationSaloonSetTimeForm, (state, { payload }) => {
        state.selectedValues.timeForm = payload;
      })
      .addCase(registrationSaloonSetServicesForm, (state, { payload }) => {
        state.selectedValues.servicesForm = payload;
      })
      .addCase(registrationSaloonSetPicturesForm, (state, { payload }) => {
        state.selectedValues.picturesForm = payload;
      })
      .addCase(registrationSaloonResetForm, (state) => {
        state.selectedValues.emailForm = EMAIL_FORM_INITIAL_STATE;
        state.selectedValues.aboutForm = ABOUT_FORM_INITIAL_STATE;
        state.selectedValues.passwordForm = PASSWORD_FORM_INITIAL_STATE;
        state.selectedValues.adressTypeForm = ADRESS_TYPE_FORM_INITIAL_STATE;
        state.selectedValues.adressForm = ADRESS_FORM_INITIAL_STATE;
        state.selectedValues.stuffCountForm = STUFF_COUNT_FORM_INITIAL_STATE;
        state.selectedValues.visitPaymentForm =
          VISIT_PAYMENT_FORM_INITIAL_STATE;
        state.selectedValues.timeForm = TIME_FORM_INITIAL_STATE;
        state.selectedValues.servicesForm = SERVICES_FORM_INITIAL_STATE;
        state.selectedValues.picturesForm = PICTURES_FORM_INITIAL_STATE;
      })
      .addCase(registrationSaloonFetchCategories.pending, (state) => {
        state.ui.isLoading = true;
      })
      .addCase(
        registrationSaloonFetchCategories.fulfilled,
        (state, { payload }) => {
          const mappedCategories = payload.map(
            ({ id, name }: { id: number; name: string }) => ({
              code: id.toString(),
              name,
            })
          );

          state.filterValues.categories = mappedCategories;
          state.ui.isLoading = false;
        }
      )
      .addCase(registrationSaloonFetchCategories.rejected, (state) => {
        state.ui.isLoading = false;
      })
      .addCase(registrationSaloonFetchCities.pending, (state) => {
        state.ui.isLoading = true;
      })
      .addCase(
        registrationSaloonFetchCities.fulfilled,
        (state, { payload }) => {
          const mappedCities = payload.map(
            ({ id, name }: { id: number; name: string }) => ({
              code: id.toString(),
              name,
            })
          );

          state.filterValues.cities = mappedCities;
          state.ui.isLoading = false;
        }
      )
      .addCase(registrationSaloonFetchCities.rejected, (state) => {
        state.ui.isLoading = false;
      })
      .addCase(registrationSaloonFetchStreetTypes.pending, (state) => {
        state.ui.isLoading = true;
      })
      .addCase(
        registrationSaloonFetchStreetTypes.fulfilled,
        (state, { payload }) => {
          const mappedStreetTypes = payload.map(
            ({ id, name }: { id: number; name: string }) => ({
              code: id.toString(),
              name,
            })
          );

          state.filterValues.streetTypes = mappedStreetTypes;
          state.ui.isLoading = false;
        }
      )
      .addCase(registrationSaloonFetchStreetTypes.rejected, (state) => {
        state.ui.isLoading = false;
      })
      .addCase(registrationSaloonPostForm.pending, (state) => {
        state.ui.isLoading = true;
      })
      .addCase(registrationSaloonPostForm.rejected, (state) => {
        state.ui.isLoading = false;
      })
      .addCase(registrationSaloonPostForm.fulfilled, (state) => {
        state.ui.isLoading = false;
      })
  );
