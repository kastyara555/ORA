export interface ProcedureDataModel {
  cityName: string;
  procedureName: string;
  saloons: {
    data: ProcedureSaloonSaloonModel[];
    total: number;
  };
}

export interface ProcedureSaloonSaloonModel {
  id: number;
  name: string;
  description: string;
  mainImage: string | null;
}
