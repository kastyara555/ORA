"use client";
import { FC } from "react";
import { MegaMenu } from "primereact/megamenu";
import { MenuItem } from "primereact/menuitem";

import styles from "./style.module.scss";

interface CategoriesMenuModel {
  categoriesTree: MenuItem[];
}

const CategoriesMenu: FC<CategoriesMenuModel> = ({ categoriesTree }) => (
  <MegaMenu breakpoint="896px" className={styles.navigation} model={categoriesTree} />
);

export default CategoriesMenu;
