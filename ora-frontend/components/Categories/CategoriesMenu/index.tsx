"use client";
import { FC, useState, useRef, useEffect, Fragment } from "react";
import cn from "classnames";

import styles from "./style.module.scss";
import Link from "next/link";

interface CategoriesMenuModel {
  categoriesTree: any[];
}

const CategoriesMenu: FC<CategoriesMenuModel> = ({ categoriesTree }) => {
  const [modalData, setModalData] = useState<null | {
    id: number;
    procedures: any;
  }>(null);
  const [wasModalOpened, setWasModalOpened] = useState<boolean>(false);

  const ref = useRef();

  const handleOutsideClick = (e: any) => {
    if (!(ref.current as any)?.contains(e.target)) setModalData(null);
  };

  useEffect(() => {
    if (!modalData && wasModalOpened) {
      document.removeEventListener("click", handleOutsideClick, false);
    } else if (modalData) {
      setWasModalOpened(true);
      document.addEventListener("click", handleOutsideClick, false);
    }
  }, [modalData]);

  return (
    <div className={styles.wrapper} ref={ref as any}>
      {categoriesTree.map(({ id, name, procedures }: any) => (
        <div
          key={id}
          className={cn(styles.category, {
            [styles.activeCategory]: modalData?.id === id,
          })}
          onClick={() => setModalData({ id, procedures })}
        >
          {name}
        </div>
      ))}
      {modalData && (
        <div className={styles.proceduresModal}>
          <div className={styles.proceduresList}>
            {modalData.procedures.map(({ id, name, url }: any) => (
              <Link key={id} href={url}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesMenu;
