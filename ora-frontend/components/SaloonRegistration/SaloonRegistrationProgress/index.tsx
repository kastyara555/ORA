"use client";
import { FC } from "react";
import classNames from "classnames";
import { ProgressBar } from "primereact/progressbar";
import { AiOutlineArrowLeft } from "react-icons/ai";

import styles from "./style.module.scss";
import { STEP_MAPPING } from "@/consts/registration";

interface SaloonRegistrationProgressModel {
  step: number;
  setStep: (newStep: number) => void;
}

const SaloonRegistrationProgress: FC<SaloonRegistrationProgressModel> = ({
  step,
  setStep,
}) => {
  return !!step ? (
    <div
      className={classNames(
        styles.wrapper,
        "mb-4",
        "px-2",
        "flex",
        "justify-content-between",
        "align-items-center",
        "w-full",
        "gap-3"
      )}
    >
      {step > 0 && (
        <div
          className={classNames(styles.backButton)}
          onClick={() => setStep(step - 1)}
        >
          <AiOutlineArrowLeft size={22} />
        </div>
      )}
      <div className="flex-1">
        <ProgressBar
          value={STEP_MAPPING[step.toString() as never] ?? 0}
          showValue={false}
          color="#ff1368"
          style={{ height: 8 }}
        />
      </div>
    </div>
  ) : (
    <div className={classNames(styles.wrapper, "mb-4", "px-2")} />
  );
};

export default SaloonRegistrationProgress;
