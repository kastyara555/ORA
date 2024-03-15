import { createSelector } from "@reduxjs/toolkit";

export const registrationSaloonSelector = createSelector(
  (state) => state,
  ({ registrationSaloon }) => registrationSaloon
);

export const registrationSaloonUiSelector = createSelector(
  registrationSaloonSelector,
  (state) => state.ui
);

export const registrationSaloonFilterValuesSelector = createSelector(
  registrationSaloonSelector,
  (state) => state.filterValues
);

export const registrationSaloonLoadingSelector = createSelector(
  registrationSaloonUiSelector,
  (state) => state.isLoading
);

export const registrationSaloonCategoriesSelector = createSelector(
  registrationSaloonFilterValuesSelector,
  (state) => state.categories
);

export const registrationSaloonCitiesSelector = createSelector(
  registrationSaloonFilterValuesSelector,
  (state) => state.cities
);

export const registrationSaloonStreetTypesSelector = createSelector(
  registrationSaloonFilterValuesSelector,
  (state) => state.streetTypes
);

export const registrationSaloonSelectedValuesSelector = createSelector(
  registrationSaloonSelector,
  (state) => state.selectedValues
);
