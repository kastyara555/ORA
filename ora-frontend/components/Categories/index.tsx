import { getProcedureCategoriesUrl } from "@/api/categories";

import Link from "next/link";

import { configureUrl } from "@/utils";

import styles from "./style.module.scss";

const Categories = async () => {
  const res = await fetch(getProcedureCategoriesUrl);
  const categories = (await res.json()).map((category: any) => ({
    ...category,
    url: configureUrl("/book", [
      { name: "categoryId", value: category.id.toString() },
    ]),
  }));

  return (
    <div className={styles.wrapper}>
      {categories.map(({ id, name, url }: any) => (
        <Link key={id} className={styles.link} href={url}>
          {name}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
