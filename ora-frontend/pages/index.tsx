import { FC } from "react";
import { MenuItem } from "primereact/menuitem";

import axiosInstance from "@/api";
import { getProceduresTreeUrl } from "@/api/categories";
import HomeScreen from "@/screens/Home";


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

interface HomeProps {
  proceduresTree: CategoryModel[];
}

const Home: FC<HomeProps> = ({ proceduresTree }) => {
  const categoriesTree = proceduresTree.map((category) => ({
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
  } as MenuItem));

  return <HomeScreen categoriesTree={categoriesTree} />;
};

export const getServerSideProps = async () => {
  try {
    const { data } = await axiosInstance.get(getProceduresTreeUrl);

    return {
      props: { proceduresTree: data },
    };
  } catch {
    return {
      props: { proceduresTree: [] },
    };
  }
}

export default Home;
