import { combineReducers } from "@reduxjs/toolkit";

import { registrationSaloon } from "@/store/registrationSaloon/reducers";

export const rootReducer = combineReducers({
  registrationSaloon,
});

export type RootState = ReturnType<typeof rootReducer>;
