import { FC } from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import axiosInstance from "@/api";
import { saloonBaseInfoUrl } from "@/api/saloon";
// import NotFound from "@/pages/404";
import ContentWrapper from "@/components/ContentWrapper";
import { SaloonBaseDataModel } from "@/models/saloon";
import SaloonScreen from "@/screens/Saloon";

interface SaloonPageProps {
  status: number;
  saloonInfo: SaloonBaseDataModel | null;
}

const SaloonPage: FC<SaloonPageProps> = ({ status, saloonInfo }) => {
  // TODO: разобраться со статусами
  // if (status === 404) {
  //   return <NotFound />;
  // }

  if (status !== 200 || !saloonInfo) {
    return <div>Что-то пошло не так.</div>;
  }

  return (
    <>
      <Head>
        <title>ORA - салон {saloonInfo.name}</title>
      </Head>
      <ContentWrapper>
        <SaloonScreen saloonData={saloonInfo} />
      </ContentWrapper>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { saloonId } = ctx.query as { saloonId: string };

  try {
    const { data } = await axiosInstance.get(saloonBaseInfoUrl(+saloonId));

    return {
      props: {
        status: 200,
        saloonInfo: data,
      },
    };
  } catch {
    return {
      props: {
        status: 400,
        saloonInfo: null,
      },
    };
  }
}

export default SaloonPage;
