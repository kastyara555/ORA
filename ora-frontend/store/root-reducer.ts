import { combineReducers } from "@reduxjs/toolkit";

import { registrationSaloon } from "@/store/registrationSaloon/reducers";
import { common } from "@/store/common/reducers";

export const rootReducer = combineReducers({
  registrationSaloon,
  common,
});

export type RootState = ReturnType<typeof rootReducer>;
