import { Reducer, createReducer } from "@reduxjs/toolkit";

import { initialRegistrationSaloonState } from "@/store/registrationSaloon/state";
import { RegistrationSaloonStoreModel } from "@/store/registrationSaloon/model";
import {
  registrationSaloonFetchCategories,
  registrationSaloonFetchCities,
  registrationSaloonPostForm,
  registrationSaloonSetAboutForm,
  registrationSaloonSetAdressForm,
  registrationSaloonSetAdressTypeForm,
  registrationSaloonSetCategoriesForm,
  registrationSaloonSetEmailForm,
  registrationSaloonSetPasswordForm,
  registrationSaloonSetPicturesForm,
  registrationSaloonSetServicesForm,
  registrationSaloonSetStuffCountForm,
  registrationSaloonSetTimeForm,
  registrationSaloonSetVisitPaymentForm,
} from "@/store/registrationSaloon/actions";

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
      .addCase(registrationSaloonSetCategoriesForm, (state, { payload }) => {
        state.selectedValues.categoriesForm = payload;
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
