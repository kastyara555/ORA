import { FC } from "react";

import { getProcedureDataUrl } from "@/api/categories";
import NotFound from "@/app/not-found";
import { configureGetServicesBody } from "@/utils/procedure";
import Procedure from "@/screens/Procedure";

interface ProcedurePageProps {
  params: {
    procedureId: string;
  };
  searchParams: {
    cityId: string;
    date: string;
  };
}

const ProcedurePage: FC<ProcedurePageProps> = async ({
  params,
  searchParams,
}) => {
  const res = await fetch(getProcedureDataUrl(params.procedureId), {
    cache: "no-cache",
    method: "POST",
    body: JSON.stringify(
      configureGetServicesBody({
        cityId: searchParams.cityId,
        date: searchParams.date,
      })
    ),
  });

  if (res.status === 500 || res.status === 400) {
    return <div>Что-то пошло не так.</div>;
  }

  if (res.status === 404) {
    return <NotFound />;
  }

  const procedureInfo = await res.json();

  return <Procedure procedure={procedureInfo} />;
};

export default ProcedurePage;
