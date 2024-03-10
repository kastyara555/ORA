import { BASE_URL } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { ClientProfileModel, SaloonProfileModel } from "@/models/profile";
import { profileEditClientForm } from "@/components/EditProfile/ClientEditProfile";
import { profileEditMasterForm } from "@/components/EditProfile/MasterEditProfile";
import { profileEditSaloonForm } from "@/components/EditProfile/SaloonEditProfile";

export const prepareClientUpdateForm = (formData: profileEditClientForm) => {
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

export const prepareMasterUpdateForm = (formData: profileEditMasterForm) => {
  const result = {
    description: formData.description,
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

export const prepareSaloonUpdateForm = (formData: profileEditSaloonForm) => {
  const result = {
    description: formData.description,
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
