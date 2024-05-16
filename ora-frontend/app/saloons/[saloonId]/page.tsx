import { FC } from "react";

import { saloonBaseInfoUrl } from "@/api/saloon";
import NotFound from "@/app/not-found";
import ContentWrapper from "@/components/ContentWrapper";
import { SaloonBaseDataModel } from "@/models/saloon";
import SaloonScreen from "@/screens/Saloon";

interface SaloonPageProps {
  params: {
    saloonId: string;
  };
}

const SaloonPage: FC<SaloonPageProps> = async ({ params }) => {
  const res = await fetch(saloonBaseInfoUrl(+params.saloonId), {
    cache: "no-cache",
  });

  if (res.status === 404) {
    return <NotFound />;
  }

  if (res.status !== 200) {
    return <div>Что-то пошло не так.</div>;
  }

  const saloonInfo = (await res.json()) as SaloonBaseDataModel;

  return (
    <ContentWrapper>
      <SaloonScreen saloonData={saloonInfo} />
    </ContentWrapper>
  );
};

export default SaloonPage;
