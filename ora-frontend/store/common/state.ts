import { CommonStoreModel } from "@/store/common/model";

export const initialCommonState: CommonStoreModel = {
  ui: {
    toast: null,
    modals: {
      bookingSidebarData: null,
    },
  },
};
