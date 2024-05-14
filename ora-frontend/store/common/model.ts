export interface CommonStoreModel {
  ui: {
    toast: null | any;
    modals: {
      bookingBannerData: null | BookingBannerDataModel;
    };
  };
}

export interface BookingBannerDataModel {
  idProcedure: number;
  idSalon: number;
}
