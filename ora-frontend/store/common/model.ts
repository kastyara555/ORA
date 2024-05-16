export interface CommonStoreModel {
  ui: {
    toast: null | any;
    modals: {
      bookingSidebarData: null | BookingSidebarDataModel;
    };
  };
}

export interface BookingSidebarDataModel {
  idProcedure: number;
  idSaloon: number;
}
