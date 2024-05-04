import { FC } from "react";

import { getProcedureDataUrl } from "@/api/categories";
import NotFound from "@/app/not-found";
import { configureGetServicesBody } from "@/utils/procedure";
import Procedure from "@/screens/Procedure";

interface ProcedureInCityPageProps {
  params: {
    procedureId: string;
    cityId: string;
  };
}

const ProcedureInCityPage: FC<ProcedureInCityPageProps> = async ({
  params,
}) => {
  // const res = await fetch(getProcedureDataUrl(params.procedureId), {
  //   cache: "no-cache",
  //   method: "POST",
  //   body: JSON.stringify(
  //     configureGetServicesBody({
  //       cityId: searchParams.cityId,
  //       date: searchParams.date,
  //     })
  //   ),
  // });

  // if (res.status === 500 || res.status === 400) {
  //   return <div>Что-то пошло не так.</div>;
  // }

  // if (res.status === 404) {
  //   return <NotFound />;
  // }

  // const procedureInfo = await res.json();

  return <Procedure procedure={{}} />;
  // return <Procedure procedure={procedureInfo} />;
};

export default ProcedureInCityPage;
