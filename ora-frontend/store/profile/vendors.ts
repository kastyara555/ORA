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
