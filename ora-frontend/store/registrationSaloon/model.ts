import {
  RegistrationSaloonEmailFormModel,
  RegistrationSaloonAboutFormModel,
  RegistrationSaloonPasswordFormModel,
  RegistrationSaloonCategoriesFormModel,
  RegistrationSaloonAdressTypeFormModel,
  RegistrationSaloonAdressFormModel,
  RegistrationSaloonStuffCountFormModel,
  RegistrationSaloonVisitPaymentFormModel,
  RegistrationSaloonTimeFormModel,
  RegistrationSaloonServicesFormModel,
  RegistrationSaloonPicturesFormModel,
} from "@/models/SaloonRegistration";

export interface RegistrationFormSelectedValuesModel {
  emailForm: RegistrationSaloonEmailFormModel;
  aboutForm: RegistrationSaloonAboutFormModel;
  passwordForm: RegistrationSaloonPasswordFormModel;
  categoriesForm: RegistrationSaloonCategoriesFormModel;
  adressTypeForm: RegistrationSaloonAdressTypeFormModel;
  adressForm: RegistrationSaloonAdressFormModel;
  stuffCountForm: RegistrationSaloonStuffCountFormModel;
  visitPaymentForm: RegistrationSaloonVisitPaymentFormModel;
  timeForm: RegistrationSaloonTimeFormModel;
  servicesForm: RegistrationSaloonServicesFormModel;
  picturesForm: RegistrationSaloonPicturesFormModel;
}

export interface RegistrationSaloonStoreModel {
  filterValues: {
    categories: any[];
    cities: any[];
    streetTypes: any[];
  };
  selectedValues: RegistrationFormSelectedValuesModel;
  ui: {
    isLoading: boolean;
  };
}
