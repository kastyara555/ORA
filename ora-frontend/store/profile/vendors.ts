import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE, USER_TYPES } from "@/consts/profile";
import { ClientProfileModel, SaloonProfileModel } from "@/models/profile";
import { profileEditClientForm } from "@/components/EditProfile/ClientEditProfile";

export const prepareProfileUpdateForm = (formData: profileEditClientForm) => {
  const result = {
    lastName: formData.lastName,
    mainImage: formData.mainImage
      ? {
          fileName: formData.mainImage.file?.name,
          fileSize: formData.mainImage.file?.size,
          fileType: formData.mainImage.file?.type,
          data: formData.mainImage.data_url,
        }
      : null,
  };

  return result;
};

export const prepareProfileData = (
  userInfo: ClientProfileModel | SaloonProfileModel
) => {
  const result = {
    ...userInfo,
    mainImage: userInfo.mainImage
      ? BASE_URL.concat(userInfo.mainImage)
      : DEFAULT_PROFILE_IMAGE,
    gallery: userInfo.gallery.map((galleryItem: string) =>
      BASE_URL.concat(galleryItem)
    ),
  };

  return result;
};
