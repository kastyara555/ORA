import { FC } from "react";
import { GetServerSidePropsContext } from "next";
import { ProcedureDataModel } from "@/models/procedure";

import axiosInstance from "@/api";
import { getProcedureDataUrl } from "@/api/categories";
// import NotFound from "@/pages/404";
import Procedure from "@/screens/Procedure";
import ContentWrapper from "@/components/ContentWrapper";
import { SALOONS_PAGE_SIZE } from "@/consts/procedure";

interface ProcedureInCityPageProps {
  status: number;
  procedureId: number;
  procedureInfo: ProcedureDataModel | null;
}

const ProcedureInCityPage: FC<ProcedureInCityPageProps> = ({
  status,
  procedureId,
  procedureInfo
}) => {
  // TODO: разобраться со статусами
  // if (status === 404) {
  //   return <NotFound />;
  // }

  if (status !== 200 || !procedureInfo) {
    return <div>Что-то пошло не так.</div>;
  }

  return (
    <ContentWrapper
      backHref={`/procedures/${procedureId}`}
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { procedureId, cityId } = ctx.query as { procedureId: string, cityId: string };

  try {
    const { data } = await axiosInstance.post(
      getProcedureDataUrl(procedureId, cityId),
      {
        pageSize: SALOONS_PAGE_SIZE,
        pageNumber: 1,
      },
    );

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

export default ProcedureInCityPage;
