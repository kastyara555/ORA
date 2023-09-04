import { getProceduresTreeUrl } from "@/api/categories";

import { configureUrl } from "@/utils";

import CategoriesMenu from "@/components/Categories/CategoriesMenu";

const Categories = async () => {
  const res = await fetch(getProceduresTreeUrl, { cache: "no-cache" });
  const tmp = await res.json();

  const categoriesTree = tmp.map((category: any) => ({
    ...category,
    procedures: [
      ...category.procedures.map((procedure: any) => ({
        ...procedure,
        url: configureUrl("/book", [
          { name: "categoryId", value: category.id.toString() },
          { name: "procedureId", value: procedure.id.toString() },
        ]),
      })),
    ],
  }));

  return (<CategoriesMenu categoriesTree={categoriesTree} />);
};

export default Categories;
