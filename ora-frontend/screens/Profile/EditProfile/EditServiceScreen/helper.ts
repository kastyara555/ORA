import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import {
  ActiveMasterInfoModel,
  MasterInfoModel,
} from "@/screens/Profile/EditProfile/EditServiceScreen/types";
import { DEFAULT_BASE_URL_BACK } from "@/api";

export const prepareServiceInfo = (data: any) => ({
  ...data,
  availableMasters: data.availableMasters.map((master: MasterInfoModel) => ({
    ...master,
    mainImage: master.mainImage
      ? DEFAULT_BASE_URL_BACK.concat(master.mainImage)
      : DEFAULT_PROFILE_IMAGE,
  })),
  activeMasters: data.activeMasters.map((master: ActiveMasterInfoModel) => ({
    ...master,
    mainImage: master.mainImage
      ? DEFAULT_BASE_URL_BACK.concat(master.mainImage)
      : DEFAULT_PROFILE_IMAGE,
  })),
});
