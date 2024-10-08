import { FC } from "react";
import { GetServerSidePropsContext } from "next";

import axiosInstance from "@/api";
import { getCitiesProcedureIdUrl } from "@/api/categories";
// import NotFound from "@/pages/404";
import ContentWrapper from "@/components/ContentWrapper";
import ProcedureCities, { City } from "@/screens/ProcedureCities";

interface ProcedureCitiesResponseModel {
  id: number;
  name: string;
  cities: City[];
}

interface ProcedurePageProps {
  status: number;
  procedureId: number;
  procedureInfo: ProcedureCitiesResponseModel | null;
}

const ProcedurePage: FC<ProcedurePageProps> = ({ status, procedureId, procedureInfo }) => {
  // TODO: разобраться со статусами
  // if (status === 404) {
  //   return <NotFound />;
  // }

  if (status !== 200 || !procedureInfo) {
    return <div>Что-то пошло не так.</div>;
  }

  return (
    <ContentWrapper title={procedureInfo.name} backHref="/">
      {procedureInfo.cities.length ? (
        <ProcedureCities
          procedureId={procedureId}
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { procedureId } = ctx.query as { procedureId: string };

  try {
    const { data } = await axiosInstance.get(getCitiesProcedureIdUrl(procedureId));

    return {
      props: {
        status: 200,
        procedureId: +procedureId,
        procedureInfo: data,
      },
    };
  } catch {
    return {
      props: {
        status: 400,
        procedureId: +procedureId,
        procedureInfo: null,
      },
    };
  }
}

export default ProcedurePage;
