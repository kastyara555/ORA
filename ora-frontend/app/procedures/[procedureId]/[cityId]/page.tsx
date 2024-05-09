import { FC } from "react";

import { getProcedureDataUrl } from "@/api/categories";
import NotFound from "@/app/not-found";
import Procedure from "@/screens/Procedure";
import ContentWrapper from "@/components/ContentWrapper";

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
      cache: "no-cache",
    }
  );

  if (res.status === 500 || res.status === 400) {
    return <div>Что-то пошло не так.</div>;
  }

  if (res.status === 404) {
    return <NotFound />;
  }

  const procedureInfo = await res.json();

  return (
    <ContentWrapper
      backHref={`/procedures/${params.procedureId}`}
      title={procedureInfo.procedureName}
    >
      {procedureInfo.saloons.length ? (
        <Procedure procedure={{}} />
      ) : (
        <p className="my-4">
          Данную услугу через наш сервис в городе {procedureInfo.cityName} пока
          никто не оказывает :(
        </p>
      )}
    </ContentWrapper>
  );
};

export default ProcedureInCityPage;
