"use client";
import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ListBox } from "primereact/listbox";

import {
  registrationSaloonCategoriesSelector,
  registrationSaloonLoadingSelector,
} from "@/store/registrationSaloon/selectors";
import { registrationSaloonFetchCategories } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";
import { Skeleton } from "primereact/skeleton";

interface SaloonRegistrationCategoriesFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationCategoriesForm: FC<
  SaloonRegistrationCategoriesFormModel
> = ({ onCountinueClick }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const dispatch = useDispatch();

  const categoriesList = useSelector(registrationSaloonCategoriesSelector);
  const loading = useSelector(registrationSaloonLoadingSelector);

  useEffect(() => {
    if (!categoriesList.length) dispatch(registrationSaloonFetchCategories() as any);
  }, []);

  const countryTemplate = (option: any) => {
    const selected = selectedCategories.includes(option);
    return (
      <div
        className={classNames("flex", "justify-content-between", "w-full", {
          [styles.selectedOption]: selected,
        })}
      >
        <div>{option.name}</div>
        <Checkbox checked={selected} />
      </div>
    );
  };

  return !loading ? (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-4",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>Выберите категорию Вашего бизнеса</h2>
      <ListBox
        value={selectedCategories}
        onChange={(e) => setSelectedCategories(e.value)}
        options={categoriesList}
        optionLabel="name"
        itemTemplate={countryTemplate}
        className="w-full"
        listStyle={{ maxHeight: 320 }}
        multiple
      />
      <Button
        className={classNames(
          styles.button,
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12"
        )}
        onClick={onCountinueClick}
      >
        Продолжить
      </Button>
    </div>
  ) : (
    <div style={{ maxWidth: 448, width: "100%" }}>
      <Skeleton width="100%" height="486px" />
    </div>
  );
};

export default SaloonRegistrationCategoriesForm;
