import cloneDeep from "lodash/cloneDeep";

import { RegistrationFormSelectedValuesModel } from "@/store/registrationSaloon/model";

export const prepareSaloonRegistrationForm = (
  selectedValues: RegistrationFormSelectedValuesModel
) => {
  const result = cloneDeep(selectedValues);

  result.emailForm = {
    ...result.emailForm,
    email: result.emailForm.email.trim(),
  };

  result.aboutForm = {
    ...result.aboutForm,
    name: result.aboutForm.name.trim(),
    saloonName: result.aboutForm.saloonName.trim(),
    description: result.aboutForm.description.trim(),
    phone: result.aboutForm.phone.replace(/\D/g, ""),
  };

  result.categoriesForm = {
    ...result.categoriesForm,
    categories: result.categoriesForm.categories.map(({ code }) => +code),
  };

  result.adressForm = {
    ...result.adressForm,
    city: +result.adressForm.city.code,
    street: result.adressTypeForm.hasAdress
      ? result.adressForm.street.trim()
      : "",
    building: result.adressTypeForm.hasAdress
      ? result.adressForm.building.trim()
      : "",
    stage: result.adressTypeForm.hasAdress
      ? result.adressForm.stage.trim()
      : "",
    office: result.adressTypeForm.hasAdress
      ? result.adressForm.office.trim()
      : "",
  };

  result.servicesForm = {
    ...result.servicesForm,
    services: result.servicesForm.services.map(
      ({ price, procedure, time }) => ({
        price,
        procedureId: procedure.procedureId,
        time: { hours: +time.hours.code, minutes: +time.minutes.code },
      })
    ),
  };

  result.picturesForm = {
    ...result.picturesForm,
    pictures: result.picturesForm.pictures
      .filter((el) => !!el)
      .map(({ file, data_url }) => ({
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        data: data_url,
      })),
  };

  return result;
};
