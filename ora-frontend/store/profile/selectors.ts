import { createSelector } from "@reduxjs/toolkit";

export const profileSelector = createSelector(
  (state) => state,
  ({ profile }) => profile,
);

export const profileUserDateSelector = createSelector(
  profileSelector,
  ({ userData }) => userData,
);

export const profileLoadingSelector = createSelector(
  profileSelector,
  ({ loading }) => loading,
);
