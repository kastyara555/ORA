import { RegistrationFormSelectedValuesModel } from "@/store/registrationSaloon/model";

export const prepareSaloonRegistrationForm = (
  selectedValues: RegistrationFormSelectedValuesModel
) => {
  const result: any = {};
  const { picturesForm, emailForm, aboutForm, adressForm, adressTypeForm, servicesForm, ...rest } = selectedValues;

  result.emailForm = {
    ...emailForm,
    email: emailForm.email.trim(),
  };

  result.aboutForm = {
    ...aboutForm,
    name: aboutForm.name.trim(),
    saloonName: aboutForm.saloonName.trim(),
    description: aboutForm.description.trim(),
    phone: aboutForm.phone.replace(/\D/g, ""),
  };

  result.adressForm = {
    ...adressForm,
    city: +adressForm.city.code,
    streetType: adressTypeForm.hasAdress
      ? +adressForm.streetType.code
      : null,
    street: adressTypeForm.hasAdress
      ? adressForm.street.trim()
      : "",
    building: adressTypeForm.hasAdress
      ? adressForm.building.trim()
      : "",
    stage: adressTypeForm.hasAdress
      ? adressForm.stage.trim()
      : "",
    office: adressTypeForm.hasAdress
      ? adressForm.office.trim()
      : "",
  };

  result.servicesForm = {
    ...servicesForm,
    services: servicesForm.services.map(
      ({ price, procedure, time }) => ({
        price,
        procedureId: procedure.procedureId,
        time: { hours: +time.hours.code, minutes: +time.minutes.code },
      })
    ),
  };

  result.picturesForm = {
    mainImage: picturesForm.pictures.length ? {
      fileName: picturesForm.pictures[0].file?.name,
      fileSize: picturesForm.pictures[0].file?.size,
      fileType: picturesForm.pictures[0].file?.type,
      data: picturesForm.pictures[0].data_url,
    } : null,
  };

  return { adressTypeForm, ...rest, ...result };
};
