import { memo } from "react";
import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import EditServicesScreen from "@/screens/Profile/EditProfile/EditServicesScreen";

const ServicesPage = () => (
  <>
    <Head>
      <title>ORA - Редактирование услуг</title>
    </Head>
    <ContentWrapper backHref="/profile" title="Редактирование услуг">
      <EditServicesScreen />
    </ContentWrapper>
  </>
);

export default memo(ServicesPage);
