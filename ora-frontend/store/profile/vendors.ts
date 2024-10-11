import { DEFAULT_BASE_URL_BACK } from "@/api";
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
      ? DEFAULT_BASE_URL_BACK.concat(userInfo.mainImage)
      : DEFAULT_PROFILE_IMAGE,
    gallery: userInfo.gallery.map((galleryItem: string) =>
      DEFAULT_BASE_URL_BACK.concat(galleryItem)
    ),
  };

  return result;
};
