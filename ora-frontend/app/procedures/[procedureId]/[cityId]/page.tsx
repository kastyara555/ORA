import { FC } from "react";
import { ProcedureDataModel } from "@/models/procedure";

import { getProcedureDataUrl } from "@/api/categories";
import NotFound from "@/app/not-found";
import Procedure from "@/screens/Procedure";
import ContentWrapper from "@/components/ContentWrapper";
import { SALOONS_PAGE_SIZE } from "@/consts/procedure";

interface ProcedureInCityPageProps {
  params: {
    procedureId: string;
    cityId: string;
  };
}

const ProcedureInCityPage: FC<ProcedureInCityPageProps> = async ({
  params,
}) => {
  const res = await fetch(
    getProcedureDataUrl(params.procedureId, params.cityId),
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageSize: SALOONS_PAGE_SIZE,
        pageNumber: 1,
      }),
    }
  );

  if (res.status === 500 || res.status === 400) {
    return <div>Что-то пошло не так.</div>;
  }

  if (res.status === 404) {
    return <NotFound />;
  }

  const procedureInfo: ProcedureDataModel = await res.json();

  return (
    <ContentWrapper
      backHref={`/procedures/${params.procedureId}`}
      title={`${procedureInfo.procedureName} (г.${procedureInfo.cityName})`}
    >
      {procedureInfo.saloons.data.length ? (
        <Procedure initialProcedure={procedureInfo} />
      ) : (
        <p className="my-4">
          Отсутствуют доступные салоны согласно заданным критериям.
        </p>
      )}
    </ContentWrapper>
  );
};

export default ProcedureInCityPage;
