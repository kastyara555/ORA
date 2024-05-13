"use client";
import { FC } from "react";
import classNames from "classnames";
import { Card } from "primereact/card";
import { usePathname, useRouter } from "next/navigation";

import { BASE_URL } from "@/api";
import Button from "@/components/Button";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { ProcedureSaloonSaloonModel } from "@/models/procedure";

import styles from "./style.module.scss";

interface ProcedureSaloonProps {
  saloonInfo: ProcedureSaloonSaloonModel;
}

const ProcedureSaloon: FC<ProcedureSaloonProps> = ({ saloonInfo }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleRecord = () => {
    const splittedPathname = pathname.split("/");

    router.push(`/saloons/${saloonInfo.id}/${splittedPathname[2]}`);
  };

  return (
    <Card className={styles.card}>
      <section className={classNames(styles.content, "w-full")}>
        <div className={classNames("flex", "align-items-center")}>
          <img
            src={
              saloonInfo.mainImage
                ? BASE_URL.concat(saloonInfo.mainImage)
                : DEFAULT_PROFILE_IMAGE
            }
            alt={saloonInfo.mainImage ?? "Главное изображение салона"}
            className={classNames(
              styles.saloonAvatar,
              "h-4rem",
              "w-4rem",
              "shadow-2",
              "mr-2"
            )}
          />
          <h3 className="ml-2">{saloonInfo.name}</h3>
        </div>
        <Button onClick={handleRecord} className={styles.chooseDataButton}>
          Выбрать дату
        </Button>
      </section>
    </Card>
  );
};

export default ProcedureSaloon;
