import { getProceduresTreeUrl } from "@/api/categories";
import CategoriesMenu from "@/components/Categories/CategoriesMenu";

interface ProcedureModel {
  id: number;
  name: string;
  url: string;
}

interface CategoryModel {
  id: number;
  name: string;
  procedures: ProcedureModel[];
}

const Categories = async () => {
  const res = await fetch(getProceduresTreeUrl, { next: { revalidate: 600 } });
  const proceduresTree = await res.json();

  const categoriesTree = proceduresTree.map((category: CategoryModel) => ({
    label: category.name,
    items: [
      [
        {
          label: null,
          items: category.procedures.map(({ id, name }: ProcedureModel) => ({
            label: name,
            url: `/procedures/${id.toString()}`,
          })),
        },
      ],
    ],
  }));

  return <CategoriesMenu categoriesTree={categoriesTree} />;
};

export default Categories;
