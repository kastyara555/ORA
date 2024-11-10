import { FC, memo } from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import EditServiceScreen from "@/screens/Profile/EditProfile/EditServiceScreen";

interface ServicePageProps {
  serviceId: string;
}

const ServicePage: FC<ServicePageProps> = ({ serviceId }) => (
  <>
    <Head>
      <title>ORA - Редактирование услуги</title>
    </Head>
    <ContentWrapper backHref="/profile/edit/services" title="Редактирование услуги">
      <EditServiceScreen serviceId={serviceId} />
    </ContentWrapper>
  </>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { serviceId } = ctx.query as { serviceId: string };

  return {
    props: {
      serviceId,
    },
  }
};

export default memo(ServicePage);
