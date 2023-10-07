"use client";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import SaloonRegistrationProgress from "@/components/SaloonRegistration/SaloonRegistrationProgress";
import SaloonRegistrationEmailForm from "@/components/SaloonRegistration/SaloonRegistrationEmailForm";
import SaloonRegistrationAboutForm from "@/components/SaloonRegistration/SaloonRegistrationAboutForm";
import SaloonRegistrationPasswordForm from "@/components/SaloonRegistration/SaloonRegistrationPasswordForm";
import SaloonRegistrationCategoriesForm from "@/components/SaloonRegistration/SaloonRegistrationCategoriesForm";
import SaloonRegistrationAdressTypeForm from "@/components/SaloonRegistration/SaloonRegistrationAdressTypeForm";
import SaloonRegistrationAdressForm from "@/components/SaloonRegistration/SaloonRegistrationAdressForm";
import SaloonRegistrationStuffCountForm from "@/components/SaloonRegistration/SaloonRegistrationStuffCountForm";
import SaloonRegistrationVisitPaymentForm from "@/components/SaloonRegistration/SaloonRegistrationVisitPaymentForm";
import SaloonRegistrationTimeForm from "@/components/SaloonRegistration/SaloonRegistrationTimeForm";
import SaloonRegistrationServicesForm from "@/components/SaloonRegistration/SaloonRegistrationServicesForm";
import SaloonRegistrationPicturesForm from "@/components/SaloonRegistration/SaloonRegistrationPicturesForm";
import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";

import styles from "./style.module.scss";

const SaloonRegistration = () => {
  const [registrationStep, setRegistrationStep] = useState(0);

  const { stuffCountForm, adressTypeForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );

  const formByStep = useMemo(() => {
    switch (registrationStep) {
      case 0:
        return (
          <SaloonRegistrationEmailForm
            onCountinueClick={() => setRegistrationStep(1)}
          />
        );
      case 1:
        return (
          <SaloonRegistrationAboutForm
            onCountinueClick={() => setRegistrationStep(2)}
          />
        );
      case 2:
        return (
          <SaloonRegistrationPasswordForm
            onCountinueClick={() => setRegistrationStep(3)}
          />
        );
      case 3:
        return (
          <SaloonRegistrationCategoriesForm
            onCountinueClick={() => setRegistrationStep(4)}
          />
        );
      case 4:
        return (
          <SaloonRegistrationAdressTypeForm
            onCountinueClick={() => setRegistrationStep(5)}
          />
        );
      case 5:
        return (
          <SaloonRegistrationAdressForm
            onCountinueClick={() => setRegistrationStep(6)}
          />
        );
      case 6:
        return (
          <SaloonRegistrationStuffCountForm
            onCountinueClick={() =>
              setRegistrationStep(!adressTypeForm.hasAdress ? 7 : 8)
            }
          />
        );
      case 7:
        return (
          <SaloonRegistrationVisitPaymentForm
            onCountinueClick={() => setRegistrationStep(8)}
          />
        );
      case 8:
        return (
          <SaloonRegistrationTimeForm
            onCountinueClick={() =>
              setRegistrationStep(stuffCountForm.count === 1 ? 9 : 10)
            }
          />
        );
      case 9:
        return (
          <SaloonRegistrationServicesForm
            onCountinueClick={() => setRegistrationStep(10)}
          />
        );
      case 10:
        return (
          <SaloonRegistrationPicturesForm
            onCountinueClick={() => setRegistrationStep(10)}
          />
        );
    }

    return <></>;
  }, [registrationStep]);

  return (
    <>
      <SaloonRegistrationProgress
        step={registrationStep}
        setPreviosStep={() => {
          if (registrationStep === 8 && adressTypeForm.hasAdress) {
            setRegistrationStep(6);
          } else if (registrationStep === 10 && stuffCountForm.count > 1) {
            setRegistrationStep(8);
          } else {
            setRegistrationStep(registrationStep - 1);
          }
        }}
      />
      <div
        className={classNames(
          styles.registrationFormWrapper,
          "flex",
          "justify-content-center",
          "w-full"
        )}
      >
        {formByStep}
      </div>
    </>
  );
};

export default SaloonRegistration;
