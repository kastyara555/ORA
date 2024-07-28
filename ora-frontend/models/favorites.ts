export interface FavoriteServiceModel {
  id: number;
  saloonId: number;
  saloonName: string;
  mainImage: string | null;
  procedureId: number;
  procedureName: string;
  cityName: string;
}
