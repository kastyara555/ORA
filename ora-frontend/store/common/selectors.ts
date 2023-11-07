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
