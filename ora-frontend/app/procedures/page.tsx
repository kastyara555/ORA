import { getProceduresUrl } from "@/api/categories";

import styles from "./page.module.scss";

const ProceduresPage = async ({ searchParams }: any) => {
  const res = await fetch(
    getProceduresUrl.concat(`/${searchParams.categoryId}`),
    { next: { revalidate: 600 } }
  );
  const services = await res.json();

  return (
    <div className={styles.main}>
      {services.map(({ id, name }: any) => (
        <div key={id}>{name}</div>
      ))}
    </div>
  );
};

export default ProceduresPage;
