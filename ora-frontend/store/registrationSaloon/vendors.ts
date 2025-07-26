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

  const { coordinates, ...adressData } = adressForm;

  result.adressForm = {
    ...adressData,
    city: +adressForm.city.code,
    ...(adressTypeForm.hasAdress
      ? {
        streetType: +adressForm.streetType.code,
        street: adressForm.street.trim(),
        ...(Array.isArray(coordinates) ? {
          xCoordinate: coordinates[1],
          yCoordinate: coordinates[0],
        } : {
          xCoordinate: null,
          yCoordinate: null,
        }),
        building: adressForm.building.trim(),
        stage: adressForm.stage.trim(),
        office: adressForm.office.trim(),
      }
      : {
        streetType: null,
        street: "",
        xCoordinate: null,
        yCoordinate: null,
        building: "",
        stage: "",
        office: "",
      }
    ),
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
