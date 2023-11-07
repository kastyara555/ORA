"use client";
import { FC, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ListBox, ListBoxChangeEvent } from "primereact/listbox";
import { Skeleton } from "primereact/skeleton";

import {
  registrationSaloonCategoriesSelector,
  registrationSaloonLoadingSelector,
  registrationSaloonSelectedValuesSelector,
} from "@/store/registrationSaloon/selectors";
import {
  registrationSaloonFetchCategories,
  registrationSaloonSetCategoriesForm,
} from "@/store/registrationSaloon/actions";
import { RegistrationSaloonCategoriesFormModel } from "@/models/SaloonRegistration";

import styles from "./style.module.scss";

interface SaloonRegistrationCategoriesFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationCategoriesForm: FC<
  SaloonRegistrationCategoriesFormModel
> = ({ onCountinueClick }) => {
  const { categoriesForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const categoriesList = useSelector(registrationSaloonCategoriesSelector);
  const loading = useSelector(registrationSaloonLoadingSelector);

  const [state, setState] =
    useState<RegistrationSaloonCategoriesFormModel>(categoriesForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetCategoriesForm(state));
    onCountinueClick();
  };

  const setCategories = (e: ListBoxChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      categories: e.value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.categories.length) return true;

    return false;
  }, [state]);

  useEffect(() => {
    if (!categoriesList.length)
      dispatch(registrationSaloonFetchCategories() as any);
  }, []);

  const categoryTemplate = (option: any) => {
    const selected = state.categories.includes(option);
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
        value={state.categories}
        onChange={setCategories}
        options={categoriesList}
        optionLabel="name"
        itemTemplate={categoryTemplate}
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
          "col-12",
          "mb-3"
        )}
        onClick={onApply}
        disabled={disabledButton}
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
