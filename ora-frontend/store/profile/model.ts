import { ClientProfileModel, SaloonProfileModel } from "@/models/profile";

export interface ProfileStoreModel {
  userData: null | ClientProfileModel | SaloonProfileModel;
  loading: boolean;
}
