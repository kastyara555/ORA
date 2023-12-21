export interface ProfileModel {
  userTypeMapId: number | null;
  userHash: string | null;
  bonusCount: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: string | null;
  userStatus: string | null;
  mainImage: string | null;
  gallery: string[];
}
