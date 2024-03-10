import { ClientProfileModel, MasterProfileModel, SaloonProfileModel } from "@/models/profile";

export interface ProfileStoreModel {
  userData: null | ClientProfileModel | MasterProfileModel | SaloonProfileModel;
  loading: boolean;
}
