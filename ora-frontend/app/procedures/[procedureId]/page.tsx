import { FC } from "react";

import { getCitiesProcedureIdUrl } from "@/api/categories";
import NotFound from "@/app/not-found";
import ContentWrapper from "@/components/ContentWrapper";
import ProcedureCities from "@/screens/ProcedureCities";

interface ProcedurePageProps {
  params: {
    procedureId: string;
  };
}

interface ProcedureCitiesResponseModel {
  name: string;
  cities: { id: number; name: string }[];
}

const ProcedurePage: FC<ProcedurePageProps> = async ({ params }) => {
  const res = await fetch(getCitiesProcedureIdUrl(params.procedureId), {
    cache: "no-cache",
  });

  if (res.status === 404) {
    return <NotFound />;
  }

  if (res.status !== 200) {
    return <div>Что-то пошло не так.</div>;
  }

  const procedureInfo = (await res.json()) as ProcedureCitiesResponseModel;

  return (
    <ContentWrapper title={procedureInfo.name} backHref="/">
      {procedureInfo.cities.length ? (
        <ProcedureCities
          procedureId={+params.procedureId}
          cities={procedureInfo.cities}
        />
      ) : (
        <p className="my-4">
          Данную услугу через наш сервис пока никто не оказывает :(
        </p>
      )}
    </ContentWrapper>
  );
};

export default ProcedurePage;
