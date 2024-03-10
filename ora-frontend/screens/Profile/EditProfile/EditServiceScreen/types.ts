export interface ServiceInfoModel {
  id: number;
  description: string;
  procedureName: string;
  activeMasters: ActiveMasterInfoModel[];
  availableMasters: MasterInfoModel[];
}

export interface MasterInfoModel {
  id: number;
  name: string;
  email: string;
  mainImage: string;
}

export interface ActiveMasterInfoModel extends MasterInfoModel {
  price: number;
}

export interface ServiceBaseDataForm {
  description: string;
}

export interface AddingMasterForm {
  price: null | number;
  master: null | MasterInfoModel;
}

export interface AddingMasterFormPayload {
  id: number;
  price: number;
}

export interface SubmitEditMasterData {
  id: number;
  price: number;
}
