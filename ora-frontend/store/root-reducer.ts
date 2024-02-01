import { combineReducers } from "@reduxjs/toolkit";

import { registrationSaloon } from "@/store/registrationSaloon/reducers";
import { common } from "@/store/common/reducers";
import { profile } from "@/store/profile/reducers";

export const rootReducer = combineReducers({
  registrationSaloon,
  common,
  profile,
});

export type RootState = ReturnType<typeof rootReducer>;
