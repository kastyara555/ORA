import { createSelector } from "@reduxjs/toolkit";

export const commonSelector = createSelector(
  (state) => state,
  ({ common }) => common
);

export const commonUiSelector = createSelector(commonSelector, ({ ui }) => ui);

export const commonUiToastSelector = createSelector(
  commonUiSelector,
  ({ toast }) => toast
);

export const commonUiModalsSelector = createSelector(
  commonUiSelector,
  ({ modals }) => modals
);

export const commonBookingModalDataSelector = createSelector(
  commonUiModalsSelector,
  ({ bookingSidebarData }) => bookingSidebarData
);
