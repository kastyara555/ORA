"use client";
import classNames from "classnames";

import { addLocale } from "primereact/api";
import SaloonRegistration from "@/components/SaloonRegistration";
import RU_LOCALE from "@/consts/locale";

const Registration = () => {
  addLocale("ru", RU_LOCALE);

  return (
    <div
      className={classNames("pt-5", "px-2", "flex", "justify-content-center", "align-items-center", "flex-column")}
    >
      <SaloonRegistration />
    </div>
  );
};

export default Registration;
